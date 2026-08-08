const Scheme = require('../models/Scheme');

// GET /api/schemes - Get eligible schemes for logged-in user
const getEligibleSchemes = async (req, res) => {
  try {
    const { age, education, income } = req.user;
    const { category, search } = req.query;

    let query = {
      category: education, // Education matches category
      minAge: { $lte: age },
      maxIncome: { $gte: income }
    };

    if (category && category !== 'all') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const schemes = await Scheme.find(query).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/schemes/all - All schemes (admin)
const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/schemes
const createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(scheme);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/schemes/:id
const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/schemes/:id
const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    res.json({ message: 'Scheme deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEligibleSchemes, getAllSchemes, createScheme, updateScheme, deleteScheme };
