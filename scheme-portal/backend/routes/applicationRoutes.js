const express = require('express');
const router = express.Router();
const { applyScheme, getMyApplications, getAllApplications, updateStatus } = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('document'), applyScheme);
router.get('/my', protect, getMyApplications);
router.get('/', protect, adminOnly, getAllApplications);
router.put('/:id/status', protect, adminOnly, updateStatus);

module.exports = router;
