/**
 * Run this script once to create an admin user and sample schemes.
 * Usage: node seed.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const Scheme = require('./models/Scheme');

  // Create admin
  const existing = await User.findOne({ email: 'saadheraa@gmail.com' });
  if (!existing) {
    await User.create({
      name: 'Portal Admin',
      email: 'saadheraa@gmail.com',
      password: 'aadhe123',
      age: 35,
      education: 'PG',
      income: 0,
      role: 'admin'
    });
    console.log('✅ Admin created: saadheraa@gmail.com / aadhe123');
  } else {
    console.log('ℹ️  Admin already exists');
  }

  // Sample schemes
  const count = await Scheme.countDocuments();
  if (count === 0) {
    await Scheme.insertMany([
      {
        title: 'PM National Merit Scholarship',
        description: 'A scholarship for meritorious students who have passed 12th standard and seeking higher education.',
        category: 'School',
        minAge: 15,
        maxIncome: 350000,
        eligibilityText: 'Must have secured 80% in 10th board exams. Family income below ₹3.5 Lakh per annum.',
        deadline: new Date('2025-12-31')
      },
      {
        title: 'Central Sector Scheme for UG Students',
        description: 'Financial assistance to undergraduate students from low income families to pursue college education.',
        category: 'UG',
        minAge: 17,
        maxIncome: 450000,
        eligibilityText: 'Enrolled in first year of UG program. Parents annual income below ₹4.5 Lakh.',
        deadline: new Date('2025-11-30')
      },
      {
        title: 'PG Indira Gandhi Scholarship',
        description: 'Scholarship for single girl child pursuing post-graduation in any recognised university.',
        category: 'PG',
        minAge: 22,
        maxIncome: 600000,
        eligibilityText: 'Must be a single girl child. Enrolled in full-time PG program. No age bar.',
        deadline: new Date('2025-10-15')
      },
      {
        title: 'Pre-Matric Scholarship Scheme',
        description: 'Support for school students from economically weaker sections to continue studies.',
        category: 'School',
        minAge: 10,
        maxIncome: 250000,
        eligibilityText: 'Studying in class 9 or 10. Parents annual income below ₹2.5 Lakh.',
        deadline: new Date('2025-09-30')
      },
      {
        title: 'UGC Research Fellowship',
        description: 'Fellowship for PG students pursuing M.Phil or PhD research in Indian universities.',
        category: 'PG',
        minAge: 21,
        maxIncome: 800000,
        eligibilityText: 'Qualified NET/GATE. Enrolled in M.Phil/PhD program in UGC recognized university.',
        deadline: new Date('2025-08-31')
      }
    ]);
    console.log('✅ 5 sample schemes inserted');
  } else {
    console.log('ℹ️  Schemes already exist, skipping');
  }

  mongoose.disconnect();
  console.log('✅ Seed complete!');
}).catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
