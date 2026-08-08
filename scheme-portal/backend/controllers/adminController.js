const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Application = require('../models/Application');

// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalSchemes = await Scheme.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'Pending' });
    const approved = await Application.countDocuments({ status: 'Approved' });
    const rejected = await Application.countDocuments({ status: 'Rejected' });
    res.json({ totalUsers, totalSchemes, totalApplications, pending, approved, rejected });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardStats, getAllUsers };
