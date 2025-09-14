const { pool } = require('../config/database');
const crypto = require('crypto');

class ChildProfile {
  constructor(profileData) {
    this.id = profileData.id;
    this.userId = profileData.user_id;
    this.ngoId = profileData.ngo_id;
    this.childCode = profileData.child_code;
    this.firstName = profileData.first_name;
    this.lastName = profileData.last_name;
    this.dateOfBirth = profileData.date_of_birth;
    this.gender = profileData.gender;
    this.country = profileData.country;
    this.city = profileData.city;
    this.schoolName = profileData.school_name;
    this.gradeLevel = profileData.grade_level;
    this.guardianName = profileData.guardian_name;
    this.guardianRelationship = profileData.guardian_relationship;
    this.guardianPhone = profileData.guardian_phone;
    this.emergencyContactName = profileData.emergency_contact_name;
    this.emergencyContactPhone = profileData.emergency_contact_phone;
    this.medicalConditions = profileData.medical_conditions;
    this.allergies = profileData.allergies;
    this.bio = profileData.bio;
    this.dreamsAspirations = profileData.dreams_aspirations;
    this.favoriteSubjects = profileData.favorite_subjects || [];
    this.hobbies = profileData.hobbies || [];
    this.languagesSpoken = profileData.languages_spoken || [];
    this.registrationType = profileData.registration_type;
    this.hasDeviceAccess = profileData.has_device_access;
    this.hasIdDocument = profileData.has_id_document;
    this.profilePhotoUrl = profileData.profile_photo_url;
    this.sponsorshipStatus = profileData.sponsorship_status;
    this.privacySettings = profileData.privacy_settings || {};
    this.profileComplete = profileData.profile_complete;
    this.createdAt = profileData.created_at;
    this.updatedAt = profileData.updated_at;
  }

  static async create(ngoId, profileData, createdByUserId, userId = null) {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      country,
      city,
      schoolName,
      gradeLevel,
      guardianName,
      guardianRelationship,
      guardianPhone,
      emergencyContactName,
      emergencyContactPhone,
      medicalConditions,
      allergies,
      bio,
      dreamsAspirations,
      favoriteSubjects,
      hobbies,
      languagesSpoken,
      registrationType,
      hasDeviceAccess,
      hasIdDocument,
      privacySettings
    } = profileData;

    // Generate unique child code
    const childCode = await ChildProfile.generateChildCode();

    const result = await pool.query(`
      INSERT INTO child_profiles (
        user_id, ngo_id, child_code, first_name, last_name, date_of_birth, gender,
        country, city, school_name, grade_level, guardian_name, guardian_relationship,
        guardian_phone, emergency_contact_name, emergency_contact_phone, medical_conditions,
        allergies, bio, dreams_aspirations, favorite_subjects, hobbies, languages_spoken,
        registration_type, has_device_access, has_id_document, privacy_settings, profile_complete
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
      RETURNING *
    `, [
      userId, ngoId, childCode, firstName, lastName, dateOfBirth, gender,
      country, city, schoolName, gradeLevel, guardianName, guardianRelationship,
      guardianPhone, emergencyContactName, emergencyContactPhone, medicalConditions,
      allergies, bio, dreamsAspirations, favoriteSubjects, hobbies, languagesSpoken,
      registrationType, hasDeviceAccess, hasIdDocument, privacySettings,
      ChildProfile.isProfileComplete(profileData)
    ]);

    return new ChildProfile(result.rows[0]);
  }

  static async generateChildCode() {
    let childCode;
    let exists = true;

    while (exists) {
      // Generate code in format: CH-YYYY-XXXX (e.g., CH-2024-A1B2)
      const year = new Date().getFullYear();
      const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
      childCode = `CH-${year}-${randomPart}`;

      const existing = await pool.query(
        'SELECT id FROM child_profiles WHERE child_code = $1',
        [childCode]
      );
      exists = existing.rows.length > 0;
    }

    return childCode;
  }

  static async findByChildCode(childCode) {
    const result = await pool.query(
      'SELECT * FROM child_profiles WHERE child_code = $1',
      [childCode]
    );

    return result.rows.length > 0 ? new ChildProfile(result.rows[0]) : null;
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM child_profiles WHERE user_id = $1',
      [userId]
    );

    return result.rows.length > 0 ? new ChildProfile(result.rows[0]) : null;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM child_profiles WHERE id = $1',
      [id]
    );

    return result.rows.length > 0 ? new ChildProfile(result.rows[0]) : null;
  }

  static async findByNgoId(ngoId, filters = {}) {
    let query = 'SELECT * FROM child_profiles WHERE ngo_id = $1';
    const params = [ngoId];
    let paramCount = 1;

    if (filters.sponsorshipStatus) {
      paramCount++;
      query += ` AND sponsorship_status = $${paramCount}`;
      params.push(filters.sponsorshipStatus);
    }

    if (filters.gender) {
      paramCount++;
      query += ` AND gender = $${paramCount}`;
      params.push(filters.gender);
    }

    if (filters.minAge || filters.maxAge) {
      const currentDate = new Date();
      if (filters.maxAge) {
        const minBirthDate = new Date();
        minBirthDate.setFullYear(currentDate.getFullYear() - filters.maxAge - 1);
        paramCount++;
        query += ` AND date_of_birth >= $${paramCount}`;
        params.push(minBirthDate.toISOString().split('T')[0]);
      }
      if (filters.minAge) {
        const maxBirthDate = new Date();
        maxBirthDate.setFullYear(currentDate.getFullYear() - filters.minAge);
        paramCount++;
        query += ` AND date_of_birth <= $${paramCount}`;
        params.push(maxBirthDate.toISOString().split('T')[0]);
      }
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows.map(row => new ChildProfile(row));
  }

  static async search(filters = {}) {
    let query = `
      SELECT cp.*, np.organization_name
      FROM child_profiles cp
      JOIN ngo_profiles np ON cp.ngo_id = np.id
      WHERE cp.sponsorship_status = 'available'
    `;
    const params = [];
    let paramCount = 0;

    if (filters.country) {
      paramCount++;
      query += ` AND cp.country = $${paramCount}`;
      params.push(filters.country);
    }

    if (filters.gender) {
      paramCount++;
      query += ` AND cp.gender = $${paramCount}`;
      params.push(filters.gender);
    }

    if (filters.minAge || filters.maxAge) {
      const currentDate = new Date();
      if (filters.maxAge) {
        const minBirthDate = new Date();
        minBirthDate.setFullYear(currentDate.getFullYear() - filters.maxAge - 1);
        paramCount++;
        query += ` AND cp.date_of_birth >= $${paramCount}`;
        params.push(minBirthDate.toISOString().split('T')[0]);
      }
      if (filters.minAge) {
        const maxBirthDate = new Date();
        maxBirthDate.setFullYear(currentDate.getFullYear() - filters.minAge);
        paramCount++;
        query += ` AND cp.date_of_birth <= $${paramCount}`;
        params.push(maxBirthDate.toISOString().split('T')[0]);
      }
    }

    if (filters.favoriteSubjects && filters.favoriteSubjects.length > 0) {
      paramCount++;
      query += ` AND cp.favorite_subjects && $${paramCount}`;
      params.push(filters.favoriteSubjects);
    }

    // Only show verified NGO children
    query += ` AND np.verification_status = 'verified'`;

    query += ' ORDER BY cp.created_at DESC';

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows.map(row => new ChildProfile(row));
  }

  async update(updates, updatedBy = null) {
    const allowedUpdates = [
      'first_name', 'last_name', 'school_name', 'grade_level', 'guardian_name',
      'guardian_relationship', 'guardian_phone', 'emergency_contact_name',
      'emergency_contact_phone', 'medical_conditions', 'allergies', 'bio',
      'dreams_aspirations', 'favorite_subjects', 'hobbies', 'languages_spoken',
      'has_device_access', 'has_id_document', 'privacy_settings'
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
    const profileComplete = ChildProfile.isProfileComplete({ ...this.toJSON(), ...updates });
    paramCount++;
    setClause.push(`profile_complete = $${paramCount}`);
    params.push(profileComplete);

    paramCount++;
    params.push(this.id);

    const query = `
      UPDATE child_profiles
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      throw new Error('Child profile not found');
    }

    // Update instance properties
    Object.assign(this, new ChildProfile(result.rows[0]));
    return this;
  }

  async updateSponsorshipStatus(status) {
    if (!['available', 'sponsored', 'graduated', 'inactive'].includes(status)) {
      throw new Error('Invalid sponsorship status');
    }

    const result = await pool.query(`
      UPDATE child_profiles
      SET sponsorship_status = $1
      WHERE id = $2
      RETURNING *
    `, [status, this.id]);

    if (result.rows.length === 0) {
      throw new Error('Child profile not found');
    }

    Object.assign(this, new ChildProfile(result.rows[0]));
    return this;
  }

  async updateProfilePhoto(photoUrl) {
    const result = await pool.query(`
      UPDATE child_profiles
      SET profile_photo_url = $1
      WHERE id = $2
      RETURNING *
    `, [photoUrl, this.id]);

    if (result.rows.length === 0) {
      throw new Error('Child profile not found');
    }

    Object.assign(this, new ChildProfile(result.rows[0]));
    return this;
  }

  async delete() {
    // Soft delete - set status to inactive instead of hard delete for audit purposes
    await pool.query(`
      UPDATE child_profiles
      SET sponsorship_status = 'inactive'
      WHERE id = $1
    `, [this.id]);
  }

  calculateAge() {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  static isProfileComplete(profileData) {
    const required = [
      'firstName', 'dateOfBirth', 'gender', 'country', 'city',
      'guardianName', 'guardianRelationship', 'emergencyContactName', 'emergencyContactPhone'
    ];
    return required.every(field => {
      const value = profileData[field];
      return value && value.toString().trim() !== '';
    });
  }

  static validateDateOfBirth(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 18); // Max 18 years old

    if (birthDate > today) {
      return { valid: false, message: 'Date of birth cannot be in the future' };
    }

    if (birthDate < minDate) {
      return { valid: false, message: 'Child must be under 18 years old' };
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

  static validatePrivacySettings(privacySettings) {
    const defaultSettings = {
      show_photo: false,
      show_full_name: false,
      show_location: true
    };

    if (!privacySettings || typeof privacySettings !== 'object') {
      return { valid: true, sanitized: defaultSettings };
    }

    const sanitized = { ...defaultSettings };

    if (typeof privacySettings.show_photo === 'boolean') {
      sanitized.show_photo = privacySettings.show_photo;
    }

    if (typeof privacySettings.show_full_name === 'boolean') {
      sanitized.show_full_name = privacySettings.show_full_name;
    }

    if (typeof privacySettings.show_location === 'boolean') {
      sanitized.show_location = privacySettings.show_location;
    }

    return { valid: true, sanitized };
  }

  isAvailableForSponsorship() {
    return this.sponsorshipStatus === 'available' && this.profileComplete;
  }

  isMinor() {
    return this.calculateAge() < 18;
  }

  canSelfManage() {
    return this.registrationType === 'self_registered' && this.userId && this.hasDeviceAccess;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      ngoId: this.ngoId,
      childCode: this.childCode,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      country: this.country,
      city: this.city,
      schoolName: this.schoolName,
      gradeLevel: this.gradeLevel,
      guardianName: this.guardianName,
      guardianRelationship: this.guardianRelationship,
      guardianPhone: this.guardianPhone,
      emergencyContactName: this.emergencyContactName,
      emergencyContactPhone: this.emergencyContactPhone,
      medicalConditions: this.medicalConditions,
      allergies: this.allergies,
      bio: this.bio,
      dreamsAspirations: this.dreamsAspirations,
      favoriteSubjects: this.favoriteSubjects,
      hobbies: this.hobbies,
      languagesSpoken: this.languagesSpoken,
      registrationType: this.registrationType,
      hasDeviceAccess: this.hasDeviceAccess,
      hasIdDocument: this.hasIdDocument,
      profilePhotoUrl: this.profilePhotoUrl,
      sponsorshipStatus: this.sponsorshipStatus,
      privacySettings: this.privacySettings,
      profileComplete: this.profileComplete,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      age: this.calculateAge()
    };
  }

  // Return privacy-safe version for public viewing
  toPublicJSON() {
    const publicData = this.toJSON();

    // Apply privacy settings
    if (!this.privacySettings.show_full_name) {
      publicData.lastName = this.lastName ? this.lastName.charAt(0) + '.' : null;
    }

    if (!this.privacySettings.show_photo) {
      delete publicData.profilePhotoUrl;
    }

    if (!this.privacySettings.show_location) {
      delete publicData.city;
    }

    // Always remove sensitive information
    delete publicData.guardianName;
    delete publicData.guardianRelationship;
    delete publicData.guardianPhone;
    delete publicData.emergencyContactName;
    delete publicData.emergencyContactPhone;
    delete publicData.medicalConditions;
    delete publicData.allergies;

    return publicData;
  }
}

module.exports = ChildProfile;