const Income = require('../models/incomeModel');

exports.addIncome = async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;
    const userId = req.user._id;

    if (!amount || !category || !date || !notes) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const incomeDate = new Date(date);
    incomeDate.setUTCHours(0, 0, 0, 0);

    const newIncome = new Income({ user_id: userId, amount, currency: 'LKR', category, date: incomeDate, notes });
    await newIncome.save();
    res.status(201).json({ success: true, message: 'Income added successfully', income: newIncome });
  } catch (error) {
    console.error('Error adding income:', error);
    res.status(500).json({ success: false, message: 'Failed to add income', error });
  }
};

exports.getIncomesByDate = async (req, res) => {
  try {
    const { year, month, day } = req.query;
    const userId = req.user._id;

    if (!year || !month || !day) {
      return res.status(400).json({ success: false, message: 'Year, month, and day are required' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, day));
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

    const incomes = await Income.find({
      user_id: userId,
      date: { $gte: startDate, $lte: endDate }
    });

    res.status(200).json({ success: true, incomes });
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch incomes', error });
  }
};

exports.getIncomesByWeek = async (req, res) => {
  try {
    const { year, month, day } = req.query;
    const userId = req.user._id;

    if (!year || !month || !day) {
      return res.status(400).json({ success: false, message: 'Year, month, and day are required' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, day));
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 6);

    const incomes = await Income.find({
      user_id: userId,
      date: { $gte: startDate, $lte: endDate }
    });

    res.status(200).json({ success: true, incomes });
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch incomes', error });
  }
};

exports.getIncomesByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.user._id;

    if (!year || !month) {
      return res.status(400).json({ success: false, message: 'Year and month are required' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const incomes = await Income.find({
      user_id: userId,
      date: { $gte: startDate, $lt: endDate }
    });

    res.status(200).json({ success: true, incomes });
  } catch (error) {
    console.error('Error fetching incomes by month:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch incomes', error });
  }
};

// Update an income
exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    Object.keys(req.body).forEach(key => {
      income[key] = req.body[key];
    });

    const updatedIncome = await income.save();
    res.json(updatedIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an income
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    await income.deleteOne();
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
