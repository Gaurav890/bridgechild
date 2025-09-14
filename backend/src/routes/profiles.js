const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { body, param, query } = require('express-validator');

// Middleware for all profile routes
router.use(authenticate);

// Sponsor Profile Routes
router.post('/sponsor',
  authorize(['sponsor']),
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('phone').optional().isLength({ min: 10, max: 20 }).withMessage('Phone number must be 10-20 characters'),
    body('sponsorshipBudget').optional().isFloat({ min: 0, max: 10000 }).withMessage('Budget must be between 0 and 10,000'),
    body('preferredChildAgeMin').optional().isInt({ min: 0, max: 18 }).withMessage('Min age must be between 0-18'),
    body('preferredChildAgeMax').optional().isInt({ min: 0, max: 18 }).withMessage('Max age must be between 0-18'),
    body('preferredChildGender').optional().isIn(['male', 'female', 'any']).withMessage('Invalid gender preference'),
    body('communicationPreference').optional().isIn(['weekly', 'monthly', 'quarterly']).withMessage('Invalid communication preference'),
    body('preferredCountries').optional().isArray().withMessage('Preferred countries must be an array'),
    body('interests').optional().isArray().withMessage('Interests must be an array')
  ],
  validateRequest,
  ProfileController.createSponsorProfile
);

router.get('/sponsor/:userId?',
  ProfileController.getSponsorProfile
);

router.put('/sponsor',
  authorize(['sponsor']),
  [
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    body('country').optional().trim().notEmpty().withMessage('Country cannot be empty'),
    body('phone').optional().isLength({ min: 10, max: 20 }).withMessage('Phone number must be 10-20 characters'),
    body('sponsorshipBudget').optional().isFloat({ min: 0, max: 10000 }).withMessage('Budget must be between 0 and 10,000'),
    body('preferredChildAgeMin').optional().isInt({ min: 0, max: 18 }).withMessage('Min age must be between 0-18'),
    body('preferredChildAgeMax').optional().isInt({ min: 0, max: 18 }).withMessage('Max age must be between 0-18'),
    body('preferredChildGender').optional().isIn(['male', 'female', 'any']).withMessage('Invalid gender preference'),
    body('communicationPreference').optional().isIn(['weekly', 'monthly', 'quarterly']).withMessage('Invalid communication preference'),
    body('preferredCountries').optional().isArray().withMessage('Preferred countries must be an array'),
    body('interests').optional().isArray().withMessage('Interests must be an array')
  ],
  validateRequest,
  ProfileController.updateSponsorProfile
);

// NGO Profile Routes
router.post('/ngo',
  authorize(['ngo']),
  [
    body('organizationName').trim().notEmpty().withMessage('Organization name is required'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('phone').isLength({ min: 10, max: 20 }).withMessage('Phone number must be 10-20 characters'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('focusAreas').isArray({ min: 1 }).withMessage('At least one focus area is required'),
    body('focusAreas.*').isIn([
      'education', 'health', 'nutrition', 'water_sanitation', 'child_protection',
      'emergency_response', 'community_development', 'skills_training', 'other'
    ]).withMessage('Invalid focus area'),
    body('website').optional().isURL().withMessage('Valid website URL required'),
    body('yearEstablished').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid year established'),
    body('staffCount').optional().isInt({ min: 0, max: 10000 }).withMessage('Staff count must be between 0-10,000'),
    body('childrenServed').optional().isInt({ min: 0, max: 100000 }).withMessage('Children served must be between 0-100,000'),
    body('registrationNumber').optional().trim(),
    body('bankAccountName').optional().trim(),
    body('bankAccountNumber').optional().trim(),
    body('bankName').optional().trim(),
    body('bankSwiftCode').optional().trim()
  ],
  validateRequest,
  ProfileController.createNGOProfile
);

router.get('/ngo/:userId?',
  ProfileController.getNGOProfile
);

router.put('/ngo',
  authorize(['ngo']),
  [
    body('organizationName').optional().trim().notEmpty().withMessage('Organization name cannot be empty'),
    body('country').optional().trim().notEmpty().withMessage('Country cannot be empty'),
    body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
    body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
    body('phone').optional().isLength({ min: 10, max: 20 }).withMessage('Phone number must be 10-20 characters'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('focusAreas').optional().isArray({ min: 1 }).withMessage('At least one focus area is required'),
    body('focusAreas.*').optional().isIn([
      'education', 'health', 'nutrition', 'water_sanitation', 'child_protection',
      'emergency_response', 'community_development', 'skills_training', 'other'
    ]).withMessage('Invalid focus area'),
    body('website').optional().isURL().withMessage('Valid website URL required'),
    body('yearEstablished').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid year established'),
    body('staffCount').optional().isInt({ min: 0, max: 10000 }).withMessage('Staff count must be between 0-10,000'),
    body('childrenServed').optional().isInt({ min: 0, max: 100000 }).withMessage('Children served must be between 0-100,000')
  ],
  validateRequest,
  ProfileController.updateNGOProfile
);

// NGO Verification Routes (Admin only)
router.post('/ngo/:profileId/verify',
  authorize(['admin']),
  [
    param('profileId').isUUID().withMessage('Valid profile ID required'),
    body('status').isIn(['pending', 'in_review', 'verified', 'rejected']).withMessage('Invalid status'),
    body('notes').optional().trim()
  ],
  validateRequest,
  ProfileController.verifyNGOProfile
);

router.get('/ngo/pending-verifications',
  authorize(['admin']),
  ProfileController.getPendingNGOVerifications
);

// Child Profile Routes
router.post('/child',
  authorize(['ngo', 'child']),
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').optional().trim(),
    body('dateOfBirth').isDate().withMessage('Valid date of birth required'),
    body('gender').isIn(['male', 'female']).withMessage('Gender must be male or female'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('guardianName').trim().notEmpty().withMessage('Guardian name is required'),
    body('guardianRelationship').trim().notEmpty().withMessage('Guardian relationship is required'),
    body('guardianPhone').optional().isLength({ min: 10, max: 20 }).withMessage('Guardian phone must be 10-20 characters'),
    body('emergencyContactName').trim().notEmpty().withMessage('Emergency contact name is required'),
    body('emergencyContactPhone').isLength({ min: 10, max: 20 }).withMessage('Emergency contact phone must be 10-20 characters'),
    body('ngoId').optional().isUUID().withMessage('Valid NGO ID required'),
    body('schoolName').optional().trim(),
    body('gradeLevel').optional().trim(),
    body('medicalConditions').optional().trim(),
    body('allergies').optional().trim(),
    body('bio').optional().trim(),
    body('dreamsAspirations').optional().trim(),
    body('favoriteSubjects').optional().isArray().withMessage('Favorite subjects must be an array'),
    body('hobbies').optional().isArray().withMessage('Hobbies must be an array'),
    body('languagesSpoken').optional().isArray().withMessage('Languages must be an array'),
    body('hasDeviceAccess').optional().isBoolean().withMessage('Has device access must be boolean'),
    body('hasIdDocument').optional().isBoolean().withMessage('Has ID document must be boolean'),
    body('privacySettings').optional().isObject().withMessage('Privacy settings must be an object')
  ],
  validateRequest,
  ProfileController.createChildProfile
);

router.get('/child/:childId',
  [param('childId').isUUID().withMessage('Valid child ID required')],
  validateRequest,
  ProfileController.getChildProfile
);

router.put('/child/:childId',
  authorize(['ngo', 'child', 'admin']),
  [
    param('childId').isUUID().withMessage('Valid child ID required'),
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim(),
    body('schoolName').optional().trim(),
    body('gradeLevel').optional().trim(),
    body('guardianName').optional().trim().notEmpty().withMessage('Guardian name cannot be empty'),
    body('guardianRelationship').optional().trim().notEmpty().withMessage('Guardian relationship cannot be empty'),
    body('guardianPhone').optional().isLength({ min: 10, max: 20 }).withMessage('Guardian phone must be 10-20 characters'),
    body('emergencyContactName').optional().trim().notEmpty().withMessage('Emergency contact name cannot be empty'),
    body('emergencyContactPhone').optional().isLength({ min: 10, max: 20 }).withMessage('Emergency contact phone must be 10-20 characters'),
    body('medicalConditions').optional().trim(),
    body('allergies').optional().trim(),
    body('bio').optional().trim(),
    body('dreamsAspirations').optional().trim(),
    body('favoriteSubjects').optional().isArray().withMessage('Favorite subjects must be an array'),
    body('hobbies').optional().isArray().withMessage('Hobbies must be an array'),
    body('languagesSpoken').optional().isArray().withMessage('Languages must be an array'),
    body('hasDeviceAccess').optional().isBoolean().withMessage('Has device access must be boolean'),
    body('hasIdDocument').optional().isBoolean().withMessage('Has ID document must be boolean'),
    body('privacySettings').optional().isObject().withMessage('Privacy settings must be an object')
  ],
  validateRequest,
  ProfileController.updateChildProfile
);

// Child Search and Management Routes
router.get('/children/search',
  authorize(['sponsor', 'admin']),
  [
    query('country').optional().trim(),
    query('gender').optional().isIn(['male', 'female']).withMessage('Invalid gender'),
    query('minAge').optional().isInt({ min: 0, max: 18 }).withMessage('Min age must be between 0-18'),
    query('maxAge').optional().isInt({ min: 0, max: 18 }).withMessage('Max age must be between 0-18'),
    query('favoriteSubjects').optional().toArray(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100')
  ],
  validateRequest,
  ProfileController.searchChildren
);

router.get('/children/my-children',
  authorize(['ngo']),
  [
    query('sponsorshipStatus').optional().isIn(['available', 'sponsored', 'graduated', 'inactive']).withMessage('Invalid sponsorship status'),
    query('gender').optional().isIn(['male', 'female']).withMessage('Invalid gender'),
    query('minAge').optional().isInt({ min: 0, max: 18 }).withMessage('Min age must be between 0-18'),
    query('maxAge').optional().isInt({ min: 0, max: 18 }).withMessage('Max age must be between 0-18'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100')
  ],
  validateRequest,
  ProfileController.getMyChildren
);

module.exports = router;