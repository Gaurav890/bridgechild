const SponsorProfile = require('../models/SponsorProfile');
const NGOProfile = require('../models/NGOProfile');
const ChildProfile = require('../models/ChildProfile');
const User = require('../models/User');

class ProfileController {
  // Sponsor Profile Management
  static async createSponsorProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      // Check if user role is sponsor
      if (req.user.role !== 'sponsor') {
        return res.status(403).json({
          error: 'Only sponsors can create sponsor profiles',
          code: 'ROLE_MISMATCH'
        });
      }

      // Check if profile already exists
      const existingProfile = await SponsorProfile.findByUserId(userId);
      if (existingProfile) {
        return res.status(409).json({
          error: 'Sponsor profile already exists',
          code: 'PROFILE_EXISTS'
        });
      }

      // Validate data
      const validationErrors = ProfileController.validateSponsorProfile(profileData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationErrors
        });
      }

      const profile = await SponsorProfile.create(userId, profileData);

      res.status(201).json({
        message: 'Sponsor profile created successfully',
        profile: profile.toJSON()
      });

    } catch (error) {
      console.error('Error creating sponsor profile:', error);
      res.status(500).json({
        error: 'Failed to create sponsor profile',
        code: 'PROFILE_CREATION_FAILED'
      });
    }
  }

  static async getSponsorProfile(req, res) {
    try {
      const userId = req.params.userId || req.user.id;

      // Check permissions
      if (req.params.userId && req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Access denied',
          code: 'ACCESS_DENIED'
        });
      }

      const profile = await SponsorProfile.findByUserId(userId);
      if (!profile) {
        return res.status(404).json({
          error: 'Sponsor profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        profile: profile.toJSON()
      });

    } catch (error) {
      console.error('Error fetching sponsor profile:', error);
      res.status(500).json({
        error: 'Failed to fetch sponsor profile',
        code: 'PROFILE_FETCH_FAILED'
      });
    }
  }

  static async updateSponsorProfile(req, res) {
    try {
      const userId = req.user.id;
      const updates = req.body;

      const profile = await SponsorProfile.findByUserId(userId);
      if (!profile) {
        return res.status(404).json({
          error: 'Sponsor profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      // Validate updates
      const validationErrors = ProfileController.validateSponsorProfile(updates, true);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationErrors
        });
      }

      await profile.update(updates);

      res.json({
        message: 'Sponsor profile updated successfully',
        profile: profile.toJSON()
      });

    } catch (error) {
      console.error('Error updating sponsor profile:', error);
      res.status(500).json({
        error: 'Failed to update sponsor profile',
        code: 'PROFILE_UPDATE_FAILED'
      });
    }
  }

  // NGO Profile Management
  static async createNGOProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      // Check if user role is ngo
      if (req.user.role !== 'ngo') {
        return res.status(403).json({
          error: 'Only NGOs can create NGO profiles',
          code: 'ROLE_MISMATCH'
        });
      }

      // Check if profile already exists
      const existingProfile = await NGOProfile.findByUserId(userId);
      if (existingProfile) {
        return res.status(409).json({
          error: 'NGO profile already exists',
          code: 'PROFILE_EXISTS'
        });
      }

      // Validate data
      const validationErrors = ProfileController.validateNGOProfile(profileData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationErrors
        });
      }

      const profile = await NGOProfile.create(userId, profileData);

      res.status(201).json({
        message: 'NGO profile created successfully. Verification required before managing children.',
        profile: profile.toJSON()
      });

    } catch (error) {
      console.error('Error creating NGO profile:', error);
      res.status(500).json({
        error: 'Failed to create NGO profile',
        code: 'PROFILE_CREATION_FAILED'
      });
    }
  }

  static async getNGOProfile(req, res) {
    try {
      const userId = req.params.userId || req.user.id;

      // Check permissions
      if (req.params.userId && req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Access denied',
          code: 'ACCESS_DENIED'
        });
      }

      const profile = await NGOProfile.findByUserId(userId);
      if (!profile) {
        return res.status(404).json({
          error: 'NGO profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      // Return appropriate version based on requester
      const isOwner = req.user.id === userId;
      const isAdmin = req.user.role === 'admin';

      res.json({
        profile: (isOwner || isAdmin) ? profile.toJSON() : profile.toPublicJSON()
      });

    } catch (error) {
      console.error('Error fetching NGO profile:', error);
      res.status(500).json({
        error: 'Failed to fetch NGO profile',
        code: 'PROFILE_FETCH_FAILED'
      });
    }
  }

  static async updateNGOProfile(req, res) {
    try {
      const userId = req.user.id;
      const updates = req.body;

      const profile = await NGOProfile.findByUserId(userId);
      if (!profile) {
        return res.status(404).json({
          error: 'NGO profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      // Validate updates
      const validationErrors = ProfileController.validateNGOProfile(updates, true);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationErrors
        });
      }

      await profile.update(updates);

      // If profile was verified and updated, may need re-verification
      if (profile.verificationStatus === 'verified') {
        await profile.updateVerificationStatus('in_review', 'Profile updated - requires re-verification');
      }

      res.json({
        message: 'NGO profile updated successfully',
        profile: profile.toJSON()
      });

    } catch (error) {
      console.error('Error updating NGO profile:', error);
      res.status(500).json({
        error: 'Failed to update NGO profile',
        code: 'PROFILE_UPDATE_FAILED'
      });
    }
  }

  // Admin functions for NGO verification
  static async verifyNGOProfile(req, res) {
    try {
      const { profileId } = req.params;
      const { status, notes } = req.body;

      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Only admins can verify NGO profiles',
          code: 'ACCESS_DENIED'
        });
      }

      const profile = await NGOProfile.findById(profileId);
      if (!profile) {
        return res.status(404).json({
          error: 'NGO profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      await profile.updateVerificationStatus(status, notes, req.user.id);

      res.json({
        message: `NGO profile ${status} successfully`,
        profile: profile.toJSON()
      });

    } catch (error) {
      console.error('Error verifying NGO profile:', error);
      res.status(500).json({
        error: 'Failed to verify NGO profile',
        code: 'VERIFICATION_FAILED'
      });
    }
  }

  static async getPendingNGOVerifications(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Only admins can view pending verifications',
          code: 'ACCESS_DENIED'
        });
      }

      const pendingProfiles = await NGOProfile.findByVerificationStatus('pending');

      res.json({
        profiles: pendingProfiles.map(profile => profile.toJSON()),
        count: pendingProfiles.length
      });

    } catch (error) {
      console.error('Error fetching pending NGO verifications:', error);
      res.status(500).json({
        error: 'Failed to fetch pending verifications',
        code: 'FETCH_FAILED'
      });
    }
  }

  // Child Profile Management
  static async createChildProfile(req, res) {
    try {
      const profileData = req.body;
      const createdByUserId = req.user.id;
      let ngoId = null;
      let childUserId = null;

      // Determine registration type and permissions
      if (req.user.role === 'ngo') {
        // NGO-assisted registration
        const ngoProfile = await NGOProfile.findByUserId(req.user.id);
        if (!ngoProfile || !ngoProfile.canManageChildren()) {
          return res.status(403).json({
            error: 'NGO must be verified and have complete profile to create child profiles',
            code: 'NGO_NOT_VERIFIED'
          });
        }
        ngoId = ngoProfile.id;
        profileData.registrationType = 'ngo_assisted';

      } else if (req.user.role === 'child') {
        // Self-registration by child
        // Check if child already has a profile
        const existingProfile = await ChildProfile.findByUserId(req.user.id);
        if (existingProfile) {
          return res.status(409).json({
            error: 'Child profile already exists',
            code: 'PROFILE_EXISTS'
          });
        }

        // For self-registration, we need NGO ID from request
        if (!profileData.ngoId) {
          return res.status(400).json({
            error: 'NGO ID is required for child self-registration',
            code: 'NGO_ID_REQUIRED'
          });
        }

        // Verify NGO exists and is verified
        const ngo = await NGOProfile.findById(profileData.ngoId);
        if (!ngo || !ngo.canManageChildren()) {
          return res.status(400).json({
            error: 'Invalid or unverified NGO',
            code: 'INVALID_NGO'
          });
        }

        ngoId = profileData.ngoId;
        childUserId = req.user.id;
        profileData.registrationType = 'self_registered';
        profileData.hasDeviceAccess = true;

      } else {
        return res.status(403).json({
          error: 'Only NGOs or children can create child profiles',
          code: 'ROLE_MISMATCH'
        });
      }

      // Validate data
      const validationErrors = ProfileController.validateChildProfile(profileData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationErrors
        });
      }

      const profile = await ChildProfile.create(ngoId, profileData, createdByUserId, childUserId);

      res.status(201).json({
        message: 'Child profile created successfully',
        profile: profile.toJSON()
      });

    } catch (error) {
      console.error('Error creating child profile:', error);
      res.status(500).json({
        error: 'Failed to create child profile',
        code: 'PROFILE_CREATION_FAILED'
      });
    }
  }

  static async getChildProfile(req, res) {
    try {
      const { childId } = req.params;
      const requestingUser = req.user;

      const profile = await ChildProfile.findById(childId);
      if (!profile) {
        return res.status(404).json({
          error: 'Child profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      // Check permissions
      let canViewFull = false;

      if (requestingUser.role === 'admin') {
        canViewFull = true;
      } else if (requestingUser.role === 'ngo') {
        const ngoProfile = await NGOProfile.findByUserId(requestingUser.id);
        canViewFull = ngoProfile && ngoProfile.id === profile.ngoId;
      } else if (requestingUser.role === 'child') {
        canViewFull = profile.userId === requestingUser.id;
      }

      if (!canViewFull && requestingUser.role !== 'sponsor') {
        return res.status(403).json({
          error: 'Access denied',
          code: 'ACCESS_DENIED'
        });
      }

      res.json({
        profile: canViewFull ? profile.toJSON() : profile.toPublicJSON()
      });

    } catch (error) {
      console.error('Error fetching child profile:', error);
      res.status(500).json({
        error: 'Failed to fetch child profile',
        code: 'PROFILE_FETCH_FAILED'
      });
    }
  }

  static async updateChildProfile(req, res) {
    try {
      const { childId } = req.params;
      const updates = req.body;
      const requestingUser = req.user;

      const profile = await ChildProfile.findById(childId);
      if (!profile) {
        return res.status(404).json({
          error: 'Child profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      // Check permissions
      let canUpdate = false;

      if (requestingUser.role === 'admin') {
        canUpdate = true;
      } else if (requestingUser.role === 'ngo') {
        const ngoProfile = await NGOProfile.findByUserId(requestingUser.id);
        canUpdate = ngoProfile && ngoProfile.id === profile.ngoId && ngoProfile.canManageChildren();
      } else if (requestingUser.role === 'child') {
        canUpdate = profile.userId === requestingUser.id && profile.canSelfManage();
      }

      if (!canUpdate) {
        return res.status(403).json({
          error: 'Access denied',
          code: 'ACCESS_DENIED'
        });
      }

      // Validate updates
      const validationErrors = ProfileController.validateChildProfile(updates, true);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationErrors
        });
      }

      await profile.update(updates, requestingUser.id);

      res.json({
        message: 'Child profile updated successfully',
        profile: profile.toJSON()
      });

    } catch (error) {
      console.error('Error updating child profile:', error);
      res.status(500).json({
        error: 'Failed to update child profile',
        code: 'PROFILE_UPDATE_FAILED'
      });
    }
  }

  // Profile search endpoints
  static async searchChildren(req, res) {
    try {
      const filters = req.query;

      // Only verified sponsors and admins can search children
      if (req.user.role === 'sponsor') {
        const sponsorProfile = await SponsorProfile.findByUserId(req.user.id);
        if (!sponsorProfile || !sponsorProfile.profileComplete) {
          return res.status(403).json({
            error: 'Complete sponsor profile required to search children',
            code: 'PROFILE_INCOMPLETE'
          });
        }
      } else if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Only sponsors and admins can search children',
          code: 'ACCESS_DENIED'
        });
      }

      const children = await ChildProfile.search(filters);

      res.json({
        children: children.map(child => child.toPublicJSON()),
        count: children.length
      });

    } catch (error) {
      console.error('Error searching children:', error);
      res.status(500).json({
        error: 'Failed to search children',
        code: 'SEARCH_FAILED'
      });
    }
  }

  static async getMyChildren(req, res) {
    try {
      if (req.user.role !== 'ngo') {
        return res.status(403).json({
          error: 'Only NGOs can view their managed children',
          code: 'ROLE_MISMATCH'
        });
      }

      const ngoProfile = await NGOProfile.findByUserId(req.user.id);
      if (!ngoProfile) {
        return res.status(404).json({
          error: 'NGO profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      const filters = req.query;
      const children = await ChildProfile.findByNgoId(ngoProfile.id, filters);

      res.json({
        children: children.map(child => child.toJSON()),
        count: children.length
      });

    } catch (error) {
      console.error('Error fetching NGO children:', error);
      res.status(500).json({
        error: 'Failed to fetch children',
        code: 'FETCH_FAILED'
      });
    }
  }

  // Validation helper methods
  static validateSponsorProfile(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate || data.firstName !== undefined) {
      if (!data.firstName || data.firstName.trim() === '') {
        errors.push({ field: 'firstName', message: 'First name is required' });
      }
    }

    if (!isUpdate || data.lastName !== undefined) {
      if (!data.lastName || data.lastName.trim() === '') {
        errors.push({ field: 'lastName', message: 'Last name is required' });
      }
    }

    if (!isUpdate || data.country !== undefined) {
      if (!data.country || data.country.trim() === '') {
        errors.push({ field: 'country', message: 'Country is required' });
      }
    }

    if (data.phone !== undefined) {
      const phoneValidation = SponsorProfile.validatePhone(data.phone);
      if (!phoneValidation.valid) {
        errors.push({ field: 'phone', message: phoneValidation.message });
      }
    }

    if (data.sponsorshipBudget !== undefined) {
      const budgetValidation = SponsorProfile.validateSponsorshipBudget(data.sponsorshipBudget);
      if (!budgetValidation.valid) {
        errors.push({ field: 'sponsorshipBudget', message: budgetValidation.message });
      }
    }

    if (data.preferredChildAgeMin !== undefined || data.preferredChildAgeMax !== undefined) {
      const ageValidation = SponsorProfile.validateAgeRange(data.preferredChildAgeMin, data.preferredChildAgeMax);
      if (!ageValidation.valid) {
        errors.push({ field: 'age_range', message: ageValidation.message });
      }
    }

    return errors;
  }

  static validateNGOProfile(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate || data.organizationName !== undefined) {
      if (!data.organizationName || data.organizationName.trim() === '') {
        errors.push({ field: 'organizationName', message: 'Organization name is required' });
      }
    }

    if (!isUpdate || data.country !== undefined) {
      if (!data.country || data.country.trim() === '') {
        errors.push({ field: 'country', message: 'Country is required' });
      }
    }

    if (!isUpdate || data.city !== undefined) {
      if (!data.city || data.city.trim() === '') {
        errors.push({ field: 'city', message: 'City is required' });
      }
    }

    if (!isUpdate || data.address !== undefined) {
      if (!data.address || data.address.trim() === '') {
        errors.push({ field: 'address', message: 'Address is required' });
      }
    }

    if (!isUpdate || data.phone !== undefined) {
      if (!data.phone || data.phone.trim() === '') {
        errors.push({ field: 'phone', message: 'Phone is required' });
      } else {
        const phoneValidation = NGOProfile.validatePhone(data.phone);
        if (!phoneValidation.valid) {
          errors.push({ field: 'phone', message: phoneValidation.message });
        }
      }
    }

    if (!isUpdate || data.description !== undefined) {
      if (!data.description || data.description.trim() === '') {
        errors.push({ field: 'description', message: 'Description is required' });
      }
    }

    if (!isUpdate || data.focusAreas !== undefined) {
      const focusValidation = NGOProfile.validateFocusAreas(data.focusAreas);
      if (!focusValidation.valid) {
        errors.push({ field: 'focusAreas', message: focusValidation.message });
      }
    }

    if (data.website !== undefined) {
      const websiteValidation = NGOProfile.validateWebsite(data.website);
      if (!websiteValidation.valid) {
        errors.push({ field: 'website', message: websiteValidation.message });
      }
    }

    if (data.yearEstablished !== undefined) {
      const yearValidation = NGOProfile.validateYearEstablished(data.yearEstablished);
      if (!yearValidation.valid) {
        errors.push({ field: 'yearEstablished', message: yearValidation.message });
      }
    }

    if (data.staffCount !== undefined) {
      const staffValidation = NGOProfile.validateStaffCount(data.staffCount);
      if (!staffValidation.valid) {
        errors.push({ field: 'staffCount', message: staffValidation.message });
      }
    }

    if (data.childrenServed !== undefined) {
      const childrenValidation = NGOProfile.validateChildrenServed(data.childrenServed);
      if (!childrenValidation.valid) {
        errors.push({ field: 'childrenServed', message: childrenValidation.message });
      }
    }

    return errors;
  }

  static validateChildProfile(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate || data.firstName !== undefined) {
      if (!data.firstName || data.firstName.trim() === '') {
        errors.push({ field: 'firstName', message: 'First name is required' });
      }
    }

    if (!isUpdate || data.dateOfBirth !== undefined) {
      if (!data.dateOfBirth) {
        errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' });
      } else {
        const dobValidation = ChildProfile.validateDateOfBirth(data.dateOfBirth);
        if (!dobValidation.valid) {
          errors.push({ field: 'dateOfBirth', message: dobValidation.message });
        }
      }
    }

    if (!isUpdate || data.gender !== undefined) {
      if (!data.gender || !['male', 'female'].includes(data.gender)) {
        errors.push({ field: 'gender', message: 'Valid gender is required (male/female)' });
      }
    }

    if (!isUpdate || data.country !== undefined) {
      if (!data.country || data.country.trim() === '') {
        errors.push({ field: 'country', message: 'Country is required' });
      }
    }

    if (!isUpdate || data.city !== undefined) {
      if (!data.city || data.city.trim() === '') {
        errors.push({ field: 'city', message: 'City is required' });
      }
    }

    if (!isUpdate || data.guardianName !== undefined) {
      if (!data.guardianName || data.guardianName.trim() === '') {
        errors.push({ field: 'guardianName', message: 'Guardian name is required' });
      }
    }

    if (!isUpdate || data.guardianRelationship !== undefined) {
      if (!data.guardianRelationship || data.guardianRelationship.trim() === '') {
        errors.push({ field: 'guardianRelationship', message: 'Guardian relationship is required' });
      }
    }

    if (!isUpdate || data.emergencyContactName !== undefined) {
      if (!data.emergencyContactName || data.emergencyContactName.trim() === '') {
        errors.push({ field: 'emergencyContactName', message: 'Emergency contact name is required' });
      }
    }

    if (!isUpdate || data.emergencyContactPhone !== undefined) {
      if (!data.emergencyContactPhone || data.emergencyContactPhone.trim() === '') {
        errors.push({ field: 'emergencyContactPhone', message: 'Emergency contact phone is required' });
      } else {
        const phoneValidation = ChildProfile.validatePhone(data.emergencyContactPhone);
        if (!phoneValidation.valid) {
          errors.push({ field: 'emergencyContactPhone', message: phoneValidation.message });
        }
      }
    }

    if (data.guardianPhone !== undefined) {
      const phoneValidation = ChildProfile.validatePhone(data.guardianPhone);
      if (!phoneValidation.valid) {
        errors.push({ field: 'guardianPhone', message: phoneValidation.message });
      }
    }

    if (data.privacySettings !== undefined) {
      const privacyValidation = ChildProfile.validatePrivacySettings(data.privacySettings);
      if (!privacyValidation.valid) {
        errors.push({ field: 'privacySettings', message: privacyValidation.message });
      }
    }

    return errors;
  }
}

module.exports = ProfileController;