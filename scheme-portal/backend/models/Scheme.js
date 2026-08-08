const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['School', 'UG', 'PG'], required: true },
  minAge: { type: Number, required: true },
  maxIncome: { type: Number, required: true },
  eligibilityText: { type: String, required: true },
  deadline: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);
