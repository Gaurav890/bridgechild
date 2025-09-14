const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const { authenticate, authorize } = require('../middleware/auth');

// Middleware for all profile routes
router.use(authenticate);

// Simple test routes without complex validation first
router.post('/sponsor',
  authorize(['sponsor']),
  ProfileController.createSponsorProfile
);

router.get('/sponsor/:userId?',
  ProfileController.getSponsorProfile
);

router.put('/sponsor',
  authorize(['sponsor']),
  ProfileController.updateSponsorProfile
);

router.post('/ngo',
  authorize(['ngo']),
  ProfileController.createNGOProfile
);

router.get('/ngo/:userId?',
  ProfileController.getNGOProfile
);

router.put('/ngo',
  authorize(['ngo']),
  ProfileController.updateNGOProfile
);

router.post('/child',
  authorize(['ngo', 'child']),
  ProfileController.createChildProfile
);

router.get('/child/:childId',
  ProfileController.getChildProfile
);

router.put('/child/:childId',
  authorize(['ngo', 'child', 'admin']),
  ProfileController.updateChildProfile
);

router.get('/children/search',
  authorize(['sponsor', 'admin']),
  ProfileController.searchChildren
);

router.get('/children/my-children',
  authorize(['ngo']),
  ProfileController.getMyChildren
);

module.exports = router;