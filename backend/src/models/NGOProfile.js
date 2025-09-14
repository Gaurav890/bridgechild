const { pool } = require('../config/database');

class NGOProfile {
  constructor(profileData) {
    this.id = profileData.id;
    this.userId = profileData.user_id;
    this.organizationName = profileData.organization_name;
    this.registrationNumber = profileData.registration_number;
    this.country = profileData.country;
    this.city = profileData.city;
    this.address = profileData.address;
    this.phone = profileData.phone;
    this.website = profileData.website;
    this.description = profileData.description;
    this.focusAreas = profileData.focus_areas || [];
    this.yearEstablished = profileData.year_established;
    this.staffCount = profileData.staff_count;
    this.childrenServed = profileData.children_served;
    this.verificationStatus = profileData.verification_status;
    this.verificationNotes = profileData.verification_notes;
    this.verifiedAt = profileData.verified_at;
    this.verifiedBy = profileData.verified_by;
    this.bankAccountName = profileData.bank_account_name;
    this.bankAccountNumber = profileData.bank_account_number;
    this.bankName = profileData.bank_name;
    this.bankSwiftCode = profileData.bank_swift_code;
    this.profileComplete = profileData.profile_complete;
    this.createdAt = profileData.created_at;
    this.updatedAt = profileData.updated_at;
  }

  static async create(userId, profileData) {
    const {
      organizationName,
      registrationNumber,
      country,
      city,
      address,
      phone,
      website,
      description,
      focusAreas,
      yearEstablished,
      staffCount,
      childrenServed,
      bankAccountName,
      bankAccountNumber,
      bankName,
      bankSwiftCode
    } = profileData;

    const result = await pool.query(`
      INSERT INTO ngo_profiles (
        user_id, organization_name, registration_number, country, city, address, phone,
        website, description, focus_areas, year_established, staff_count, children_served,
        bank_account_name, bank_account_number, bank_name, bank_swift_code, profile_complete
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `, [
      userId, organizationName, registrationNumber, country, city, address, phone,
      website, description, focusAreas, yearEstablished, staffCount, childrenServed,
      bankAccountName, bankAccountNumber, bankName, bankSwiftCode,
      NGOProfile.isProfileComplete(profileData)
    ]);

    return new NGOProfile(result.rows[0]);
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM ngo_profiles WHERE user_id = $1',
      [userId]
    );

    return result.rows.length > 0 ? new NGOProfile(result.rows[0]) : null;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM ngo_profiles WHERE id = $1',
      [id]
    );

    return result.rows.length > 0 ? new NGOProfile(result.rows[0]) : null;
  }

  static async findByVerificationStatus(status) {
    const result = await pool.query(
      'SELECT * FROM ngo_profiles WHERE verification_status = $1 ORDER BY created_at DESC',
      [status]
    );

    return result.rows.map(row => new NGOProfile(row));
  }

  static async search(filters = {}) {
    let query = `
      SELECT np.*, u.email
      FROM ngo_profiles np
      JOIN users u ON np.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (filters.country) {
      paramCount++;
      query += ` AND np.country = $${paramCount}`;
      params.push(filters.country);
    }

    if (filters.verificationStatus) {
      paramCount++;
      query += ` AND np.verification_status = $${paramCount}`;
      params.push(filters.verificationStatus);
    }

    if (filters.focusAreas && filters.focusAreas.length > 0) {
      paramCount++;
      query += ` AND np.focus_areas && $${paramCount}`;
      params.push(filters.focusAreas);
    }

    if (filters.verified) {
      query += ` AND np.verification_status = 'verified'`;
    }

    query += ' ORDER BY np.created_at DESC';

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows.map(row => new NGOProfile(row));
  }

  async update(updates) {
    const allowedUpdates = [
      'organization_name', 'registration_number', 'country', 'city', 'address', 'phone',
      'website', 'description', 'focus_areas', 'year_established', 'staff_count',
      'children_served', 'bank_account_name', 'bank_account_number', 'bank_name', 'bank_swift_code'
    ];

    const setClause = [];
    const params = [];
    let paramCount = 0;

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        paramCount++;
        setClause.push(`${key} = $${paramCount}`);
        params.push(updates[key]);
      }
    });

    if (setClause.length === 0) {
      throw new Error('No valid updates provided');
    }

    // Check if profile is complete after update
    const profileComplete = NGOProfile.isProfileComplete({ ...this.toJSON(), ...updates });
    paramCount++;
    setClause.push(`profile_complete = $${paramCount}`);
    params.push(profileComplete);

    paramCount++;
    params.push(this.id);

    const query = `
      UPDATE ngo_profiles
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      throw new Error('NGO profile not found');
    }

    // Update instance properties
    Object.assign(this, new NGOProfile(result.rows[0]));
    return this;
  }

  async updateVerificationStatus(status, notes = null, verifiedBy = null) {
    if (!['pending', 'in_review', 'verified', 'rejected'].includes(status)) {
      throw new Error('Invalid verification status');
    }

    const updates = {
      verification_status: status,
      verification_notes: notes
    };

    if (status === 'verified') {
      updates.verified_at = new Date();
      updates.verified_by = verifiedBy;
    }

    const result = await pool.query(`
      UPDATE ngo_profiles
      SET verification_status = $1, verification_notes = $2, verified_at = $3, verified_by = $4
      WHERE id = $5
      RETURNING *
    `, [status, notes, updates.verified_at || null, verifiedBy, this.id]);

    if (result.rows.length === 0) {
      throw new Error('NGO profile not found');
    }

    Object.assign(this, new NGOProfile(result.rows[0]));
    return this;
  }

  async delete() {
    await pool.query('DELETE FROM ngo_profiles WHERE id = $1', [this.id]);
  }

  static isProfileComplete(profileData) {
    const required = [
      'organizationName', 'country', 'city', 'address', 'phone', 'description', 'focusAreas'
    ];
    return required.every(field => {
      const value = profileData[field];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.toString().trim() !== '';
    });
  }

  static validateYearEstablished(year) {
    if (year !== null && year !== undefined) {
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        return { valid: false, message: `Year established must be between 1900 and ${currentYear}` };
      }
    }
    return { valid: true };
  }

  static validateStaffCount(count) {
    if (count !== null && count !== undefined) {
      if (count < 0 || count > 10000) {
        return { valid: false, message: 'Staff count must be between 0 and 10,000' };
      }
    }
    return { valid: true };
  }

  static validateChildrenServed(count) {
    if (count !== null && count !== undefined) {
      if (count < 0 || count > 100000) {
        return { valid: false, message: 'Children served count must be between 0 and 100,000' };
      }
    }
    return { valid: true };
  }

  static validatePhone(phone) {
    if (phone && phone.length > 0) {
      const phoneRegex = /^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){10,14}$/;
      if (!phoneRegex.test(phone)) {
        return { valid: false, message: 'Please enter a valid phone number' };
      }
    }
    return { valid: true };
  }

  static validateWebsite(website) {
    if (website && website.length > 0) {
      try {
        new URL(website);
        return { valid: true };
      } catch {
        return { valid: false, message: 'Please enter a valid website URL' };
      }
    }
    return { valid: true };
  }

  static validateFocusAreas(focusAreas) {
    const validAreas = [
      'education', 'health', 'nutrition', 'water_sanitation', 'child_protection',
      'emergency_response', 'community_development', 'skills_training', 'other'
    ];

    if (!Array.isArray(focusAreas) || focusAreas.length === 0) {
      return { valid: false, message: 'At least one focus area is required' };
    }

    const invalidAreas = focusAreas.filter(area => !validAreas.includes(area));
    if (invalidAreas.length > 0) {
      return { valid: false, message: `Invalid focus areas: ${invalidAreas.join(', ')}` };
    }

    return { valid: true };
  }

  isVerified() {
    return this.verificationStatus === 'verified';
  }

  canManageChildren() {
    return this.isVerified() && this.profileComplete;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      organizationName: this.organizationName,
      registrationNumber: this.registrationNumber,
      country: this.country,
      city: this.city,
      address: this.address,
      phone: this.phone,
      website: this.website,
      description: this.description,
      focusAreas: this.focusAreas,
      yearEstablished: this.yearEstablished,
      staffCount: this.staffCount,
      childrenServed: this.childrenServed,
      verificationStatus: this.verificationStatus,
      verificationNotes: this.verificationNotes,
      verifiedAt: this.verifiedAt,
      verifiedBy: this.verifiedBy,
      bankAccountName: this.bankAccountName,
      bankAccountNumber: this.bankAccountNumber,
      bankName: this.bankName,
      bankSwiftCode: this.bankSwiftCode,
      profileComplete: this.profileComplete,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Return safe public version without sensitive banking info
  toPublicJSON() {
    const publicData = this.toJSON();
    delete publicData.bankAccountName;
    delete publicData.bankAccountNumber;
    delete publicData.bankName;
    delete publicData.bankSwiftCode;
    delete publicData.verificationNotes;
    return publicData;
  }
}

module.exports = NGOProfile;