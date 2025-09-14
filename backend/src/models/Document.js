const { pool } = require('../config/database');

class Document {
  constructor(documentData) {
    this.id = documentData.id;
    this.ownerId = documentData.owner_id;
    this.ownerType = documentData.owner_type;
    this.documentType = documentData.document_type;
    this.fileName = documentData.file_name;
    this.filePath = documentData.file_path;
    this.fileSize = documentData.file_size;
    this.mimeType = documentData.mime_type;
    this.verificationStatus = documentData.verification_status;
    this.verificationNotes = documentData.verification_notes;
    this.verifiedBy = documentData.verified_by;
    this.verifiedAt = documentData.verified_at;
    this.uploadedBy = documentData.uploaded_by;
    this.isSensitive = documentData.is_sensitive;
    this.expiryDate = documentData.expiry_date;
    this.createdAt = documentData.created_at;
    this.updatedAt = documentData.updated_at;
  }

  static async create(documentData) {
    const {
      ownerId,
      ownerType,
      documentType,
      fileName,
      filePath,
      fileSize,
      mimeType,
      uploadedBy,
      isSensitive = true,
      expiryDate = null
    } = documentData;

    const result = await pool.query(`
      INSERT INTO documents (
        owner_id, owner_type, document_type, file_name, file_path, file_size,
        mime_type, uploaded_by, is_sensitive, expiry_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      ownerId, ownerType, documentType, fileName, filePath, fileSize,
      mimeType, uploadedBy, isSensitive, expiryDate
    ]);

    return new Document(result.rows[0]);
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM documents WHERE id = $1',
      [id]
    );

    return result.rows.length > 0 ? new Document(result.rows[0]) : null;
  }

  static async findByOwner(ownerId, ownerType) {
    const result = await pool.query(
      'SELECT * FROM documents WHERE owner_id = $1 AND owner_type = $2 ORDER BY created_at DESC',
      [ownerId, ownerType]
    );

    return result.rows.map(row => new Document(row));
  }

  static async findByType(ownerId, ownerType, documentType) {
    const result = await pool.query(
      'SELECT * FROM documents WHERE owner_id = $1 AND owner_type = $2 AND document_type = $3 ORDER BY created_at DESC',
      [ownerId, ownerType, documentType]
    );

    return result.rows.map(row => new Document(row));
  }

  static async findByVerificationStatus(status, filters = {}) {
    let query = 'SELECT * FROM documents WHERE verification_status = $1';
    const params = [status];
    let paramCount = 1;

    if (filters.ownerType) {
      paramCount++;
      query += ` AND owner_type = $${paramCount}`;
      params.push(filters.ownerType);
    }

    if (filters.documentType) {
      paramCount++;
      query += ` AND document_type = $${paramCount}`;
      params.push(filters.documentType);
    }

    if (filters.isSensitive !== undefined) {
      paramCount++;
      query += ` AND is_sensitive = $${paramCount}`;
      params.push(filters.isSensitive);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows.map(row => new Document(row));
  }

  static async findExpiring(daysBefore = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysBefore);

    const result = await pool.query(
      'SELECT * FROM documents WHERE expiry_date <= $1 AND expiry_date > CURRENT_DATE ORDER BY expiry_date ASC',
      [expiryDate.toISOString().split('T')[0]]
    );

    return result.rows.map(row => new Document(row));
  }

  async updateVerificationStatus(status, notes = null, verifiedBy = null) {
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      throw new Error('Invalid verification status');
    }

    const updates = {
      verification_status: status,
      verification_notes: notes
    };

    if (status === 'verified') {
      updates.verified_at = new Date();
      updates.verified_by = verifiedBy;
    } else {
      updates.verified_at = null;
      updates.verified_by = null;
    }

    const result = await pool.query(`
      UPDATE documents
      SET verification_status = $1, verification_notes = $2, verified_at = $3, verified_by = $4
      WHERE id = $5
      RETURNING *
    `, [status, notes, updates.verified_at, updates.verified_by, this.id]);

    if (result.rows.length === 0) {
      throw new Error('Document not found');
    }

    Object.assign(this, new Document(result.rows[0]));
    return this;
  }

  async updateExpiryDate(expiryDate) {
    const result = await pool.query(`
      UPDATE documents
      SET expiry_date = $1
      WHERE id = $2
      RETURNING *
    `, [expiryDate, this.id]);

    if (result.rows.length === 0) {
      throw new Error('Document not found');
    }

    Object.assign(this, new Document(result.rows[0]));
    return this;
  }

  async delete() {
    await pool.query('DELETE FROM documents WHERE id = $1', [this.id]);
  }

  isExpired() {
    if (!this.expiryDate) return false;
    return new Date(this.expiryDate) < new Date();
  }

  isExpiringSoon(daysBefore = 30) {
    if (!this.expiryDate) return false;
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + daysBefore);
    return new Date(this.expiryDate) <= warningDate;
  }

  isVerified() {
    return this.verificationStatus === 'verified';
  }

  static validateDocumentType(documentType) {
    const validTypes = [
      'id_card', 'birth_certificate', 'school_certificate', 'medical_record',
      'ngo_registration', 'tax_certificate', 'bank_statement', 'other'
    ];

    if (!validTypes.includes(documentType)) {
      return { valid: false, message: 'Invalid document type' };
    }

    return { valid: true };
  }

  static validateOwnerType(ownerType) {
    const validTypes = ['user', 'child', 'ngo'];

    if (!validTypes.includes(ownerType)) {
      return { valid: false, message: 'Invalid owner type' };
    }

    return { valid: true };
  }

  static validateMimeType(mimeType) {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(mimeType)) {
      return { valid: false, message: 'File type not allowed' };
    }

    return { valid: true };
  }

  static validateFileSize(fileSize, maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (fileSize > maxSizeBytes) {
      return { valid: false, message: `File size cannot exceed ${maxSizeMB}MB` };
    }

    return { valid: true };
  }

  static getRequiredDocumentsForOwnerType(ownerType) {
    const requirements = {
      ngo: [
        { type: 'ngo_registration', required: true, description: 'NGO Registration Certificate' },
        { type: 'tax_certificate', required: false, description: 'Tax Exemption Certificate' },
        { type: 'bank_statement', required: false, description: 'Bank Account Statement' }
      ],
      child: [
        { type: 'birth_certificate', required: true, description: 'Birth Certificate or ID Card' },
        { type: 'school_certificate', required: false, description: 'School Enrollment Certificate' },
        { type: 'medical_record', required: false, description: 'Medical Records' }
      ],
      user: [
        { type: 'id_card', required: false, description: 'Government ID' }
      ]
    };

    return requirements[ownerType] || [];
  }

  static async getDocumentCompleteness(ownerId, ownerType) {
    const required = Document.getRequiredDocumentsForOwnerType(ownerType);
    const existing = await Document.findByOwner(ownerId, ownerType);

    const completeness = {
      total: required.length,
      completed: 0,
      verified: 0,
      missing: [],
      pending: [],
      rejected: []
    };

    required.forEach(req => {
      const docs = existing.filter(doc => doc.documentType === req.type);

      if (docs.length === 0) {
        if (req.required) {
          completeness.missing.push(req);
        }
      } else {
        completeness.completed++;
        const verifiedDocs = docs.filter(doc => doc.verificationStatus === 'verified');
        const pendingDocs = docs.filter(doc => doc.verificationStatus === 'pending');
        const rejectedDocs = docs.filter(doc => doc.verificationStatus === 'rejected');

        if (verifiedDocs.length > 0) {
          completeness.verified++;
        } else if (pendingDocs.length > 0) {
          completeness.pending.push(req);
        } else if (rejectedDocs.length > 0) {
          completeness.rejected.push(req);
        }
      }
    });

    completeness.completionRate = completeness.total > 0
      ? (completeness.completed / completeness.total) * 100
      : 100;

    completeness.verificationRate = completeness.total > 0
      ? (completeness.verified / completeness.total) * 100
      : 100;

    return completeness;
  }

  toJSON() {
    return {
      id: this.id,
      ownerId: this.ownerId,
      ownerType: this.ownerType,
      documentType: this.documentType,
      fileName: this.fileName,
      filePath: this.filePath,
      fileSize: this.fileSize,
      mimeType: this.mimeType,
      verificationStatus: this.verificationStatus,
      verificationNotes: this.verificationNotes,
      verifiedBy: this.verifiedBy,
      verifiedAt: this.verifiedAt,
      uploadedBy: this.uploadedBy,
      isSensitive: this.isSensitive,
      expiryDate: this.expiryDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isExpired: this.isExpired(),
      isExpiringSoon: this.isExpiringSoon()
    };
  }

  // Return safe version without file path for public viewing
  toPublicJSON() {
    const publicData = this.toJSON();
    delete publicData.filePath;
    if (this.isSensitive) {
      delete publicData.verificationNotes;
    }
    return publicData;
  }
}

module.exports = Document;