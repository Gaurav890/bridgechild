const { pool } = require('../config/database');

class SponsorProfile {
  constructor(profileData) {
    this.id = profileData.id;
    this.userId = profileData.user_id;
    this.firstName = profileData.first_name;
    this.lastName = profileData.last_name;
    this.phone = profileData.phone;
    this.country = profileData.country;
    this.city = profileData.city;
    this.occupation = profileData.occupation;
    this.bio = profileData.bio;
    this.sponsorshipBudget = profileData.sponsorship_budget;
    this.preferredChildAgeMin = profileData.preferred_child_age_min;
    this.preferredChildAgeMax = profileData.preferred_child_age_max;
    this.preferredChildGender = profileData.preferred_child_gender;
    this.preferredCountries = profileData.preferred_countries || [];
    this.interests = profileData.interests || [];
    this.communicationPreference = profileData.communication_preference;
    this.profileComplete = profileData.profile_complete;
    this.createdAt = profileData.created_at;
    this.updatedAt = profileData.updated_at;
  }

  static async create(userId, profileData) {
    const {
      firstName,
      lastName,
      phone,
      country,
      city,
      occupation,
      bio,
      sponsorshipBudget,
      preferredChildAgeMin,
      preferredChildAgeMax,
      preferredChildGender,
      preferredCountries,
      interests,
      communicationPreference
    } = profileData;

    const result = await pool.query(`
      INSERT INTO sponsor_profiles (
        user_id, first_name, last_name, phone, country, city, occupation, bio,
        sponsorship_budget, preferred_child_age_min, preferred_child_age_max,
        preferred_child_gender, preferred_countries, interests, communication_preference,
        profile_complete
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      userId, firstName, lastName, phone, country, city, occupation, bio,
      sponsorshipBudget, preferredChildAgeMin, preferredChildAgeMax,
      preferredChildGender, preferredCountries, interests, communicationPreference,
      SponsorProfile.isProfileComplete(profileData)
    ]);

    return new SponsorProfile(result.rows[0]);
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM sponsor_profiles WHERE user_id = $1',
      [userId]
    );

    return result.rows.length > 0 ? new SponsorProfile(result.rows[0]) : null;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM sponsor_profiles WHERE id = $1',
      [id]
    );

    return result.rows.length > 0 ? new SponsorProfile(result.rows[0]) : null;
  }

  static async search(filters = {}) {
    let query = `
      SELECT sp.*, u.email
      FROM sponsor_profiles sp
      JOIN users u ON sp.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (filters.country) {
      paramCount++;
      query += ` AND sp.country = $${paramCount}`;
      params.push(filters.country);
    }

    if (filters.minBudget) {
      paramCount++;
      query += ` AND sp.sponsorship_budget >= $${paramCount}`;
      params.push(filters.minBudget);
    }

    if (filters.maxBudget) {
      paramCount++;
      query += ` AND sp.sponsorship_budget <= $${paramCount}`;
      params.push(filters.maxBudget);
    }

    if (filters.interests && filters.interests.length > 0) {
      paramCount++;
      query += ` AND sp.interests && $${paramCount}`;
      params.push(filters.interests);
    }

    query += ' ORDER BY sp.created_at DESC';

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows.map(row => new SponsorProfile(row));
  }

  async update(updates) {
    const allowedUpdates = [
      'first_name', 'last_name', 'phone', 'country', 'city', 'occupation', 'bio',
      'sponsorship_budget', 'preferred_child_age_min', 'preferred_child_age_max',
      'preferred_child_gender', 'preferred_countries', 'interests', 'communication_preference'
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
    const profileComplete = SponsorProfile.isProfileComplete({ ...this.toJSON(), ...updates });
    paramCount++;
    setClause.push(`profile_complete = $${paramCount}`);
    params.push(profileComplete);

    paramCount++;
    params.push(this.id);

    const query = `
      UPDATE sponsor_profiles
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      throw new Error('Sponsor profile not found');
    }

    // Update instance properties
    Object.assign(this, new SponsorProfile(result.rows[0]));
    return this;
  }

  async delete() {
    await pool.query('DELETE FROM sponsor_profiles WHERE id = $1', [this.id]);
  }

  static isProfileComplete(profileData) {
    const required = ['firstName', 'lastName', 'country', 'sponsorshipBudget'];
    return required.every(field => profileData[field] && profileData[field].toString().trim() !== '');
  }

  static validateSponsorshipBudget(budget) {
    if (budget !== null && budget !== undefined) {
      const numBudget = parseFloat(budget);
      if (isNaN(numBudget) || numBudget < 0) {
        return { valid: false, message: 'Sponsorship budget must be a positive number' };
      }
      if (numBudget > 10000) {
        return { valid: false, message: 'Sponsorship budget cannot exceed $10,000' };
      }
    }
    return { valid: true };
  }

  static validateAgeRange(minAge, maxAge) {
    if (minAge !== null && minAge !== undefined) {
      if (minAge < 0 || minAge > 18) {
        return { valid: false, message: 'Minimum age must be between 0 and 18' };
      }
    }

    if (maxAge !== null && maxAge !== undefined) {
      if (maxAge < 0 || maxAge > 18) {
        return { valid: false, message: 'Maximum age must be between 0 and 18' };
      }
    }

    if (minAge !== null && maxAge !== null && minAge > maxAge) {
      return { valid: false, message: 'Minimum age cannot be greater than maximum age' };
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

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      country: this.country,
      city: this.city,
      occupation: this.occupation,
      bio: this.bio,
      sponsorshipBudget: this.sponsorshipBudget,
      preferredChildAgeMin: this.preferredChildAgeMin,
      preferredChildAgeMax: this.preferredChildAgeMax,
      preferredChildGender: this.preferredChildGender,
      preferredCountries: this.preferredCountries,
      interests: this.interests,
      communicationPreference: this.communicationPreference,
      profileComplete: this.profileComplete,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = SponsorProfile;