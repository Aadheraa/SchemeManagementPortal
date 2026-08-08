const Application = require('../models/Application');
const Scheme = require('../models/Scheme');

// POST /api/applications
const applyScheme = async (req, res) => {
  try {
    const { schemeId } = req.body;
    const existing = await Application.findOne({ user: req.user._id, scheme: schemeId });
    if (existing) return res.status(400).json({ message: 'Already applied for this scheme' });

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });

    const application = await Application.create({
      user: req.user._id,
      scheme: schemeId,
      document: req.file ? req.file.filename : null
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/applications/my
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id })
      .populate('scheme', 'title category deadline')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/applications (admin)
const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate('user', 'name email education income age')
      .populate('scheme', 'title category')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/applications/:id/status (admin)
const updateStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true }
    ).populate('user', 'name').populate('scheme', 'title');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { applyScheme, getMyApplications, getAllApplications, updateStatus };
