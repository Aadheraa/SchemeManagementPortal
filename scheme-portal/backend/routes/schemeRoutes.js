const express = require('express');
const router = express.Router();
const { getEligibleSchemes, getAllSchemes, createScheme, updateScheme, deleteScheme } = require('../controllers/schemeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getEligibleSchemes);
router.get('/all', protect, adminOnly, getAllSchemes);
router.post('/', protect, adminOnly, createScheme);
router.put('/:id', protect, adminOnly, updateScheme);
router.delete('/:id', protect, adminOnly, deleteScheme);

module.exports = router;
