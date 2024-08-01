const mongoose = require('mongoose');

const categoryCostsSchema = new mongoose.Schema({
  food: { type: Number, default: 0 },
  transportation: { type: Number, default: 0 },
  education: { type: Number, default: 0 },
  utilities: { type: Number, default: 0 },
  household: { type: Number, default: 0 },
  rent: { type: Number, default: 0 },
  healthcare: { type: Number, default: 0 },
  others: { type: Number, default: 0 }
}, { _id: false });

const budgetSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expectedTotalCost: {
    type: Number,
    required: true
  },
  categoryCosts: {
    type: categoryCostsSchema,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
