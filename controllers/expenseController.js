const Expense = require('../models/expenseModel');

exports.addExpense = async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;
    const userId = req.user._id;

    if (!amount || !category || !date || !notes) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const expenseDate = new Date(date);
    expenseDate.setUTCHours(0, 0, 0, 0);

    const newExpense = new Expense({ user_id: userId, amount, currency: 'LKR', category, date: expenseDate, notes });
    await newExpense.save();
    res.status(201).json({ success: true, message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ success: false, message: 'Failed to add expense', error });
  }
};

exports.getExpensesByDate = async (req, res) => {
  try {
    const { year, month, day } = req.query;
    const userId = req.user._id;

    if (!year || !month || !day) {
      return res.status(400).json({ success: false, message: 'Year, month, and day are required' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, day));
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

    const expenses = await Expense.find({
      user_id: userId,
      date: { $gte: startDate, $lte: endDate }
    });

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch expenses', error });
  }
};

exports.getExpensesByWeek = async (req, res) => {
  try {
    const { year, month, day } = req.query;
    const userId = req.user._id;

    if (!year || !month || !day) {
      return res.status(400).json({ success: false, message: 'Year, month, and day are required' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, day));
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 6);

    const expenses = await Expense.find({
      user_id: userId,
      date: { $gte: startDate, $lte: endDate }
    });

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch expenses', error });
  }
};

exports.getExpensesByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.user._id;

    if (!year || !month) {
      return res.status(400).json({ success: false, message: 'Year and month are required' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const expenses = await Expense.find({
      user_id: userId,
      date: { $gte: startDate, $lt: endDate }
    });

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error('Error fetching expenses by month:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch expenses', error });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    Object.keys(req.body).forEach(key => {
      expense[key] = req.body[key];
    });

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status (500).json({ message: error.message });
  }
};