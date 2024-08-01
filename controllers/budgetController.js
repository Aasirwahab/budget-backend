const Budget = require('../models/budgetModel');

exports.addBudget = async (req, res) => {
  try {
    const { expectedTotalCost, categoryCosts, year, month } = req.body;
    const userId = req.user._id;

    console.log('Incoming data:', req.body); // Log the incoming data

    if (!expectedTotalCost || !year || !month || !categoryCosts) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Ensure categoryCosts is an object and validate its structure
    if (typeof categoryCosts !== 'object' || Array.isArray(categoryCosts)) {
      return res.status(400).json({ success: false, message: 'Invalid categoryCosts format' });
    }

    // Validate each category cost value
    for (const [key, value] of Object.entries(categoryCosts)) {
      if (typeof value !== 'number' || value < 0) {
        return res.status(400).json({ success: false, message: `Invalid value for category ${key}` });
      }
    }

    const budgetDate = new Date(Date.UTC(year, month - 1, 1));

    const newBudget = new Budget({
      user_id: userId,
      expectedTotalCost,
      categoryCosts,
      date: budgetDate
    });

    console.log('Saving budget:', newBudget); // Log the budget object being saved

    await newBudget.save();
    res.status(201).json({ success: true, message: 'Budget added successfully', budget: newBudget });
  } catch (error) {
    console.error('Error adding budget:', error);
    res.status(500).json({ success: false, message: 'Failed to add budget', error: error.message });
  }
};

exports.getBudgetByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.user._id;

    if (!year || !month) {
      return res.status(400).json({ success: false, message: 'Year and month are required' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const budget = await Budget.findOne({
      user_id: userId,
      date: { $gte: startDate, $lt: endDate }
    });

    res.status(200).json({ success: true, budget });
  } catch (error) {
    console.error('Error fetching budget by month:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch budget', error });
  }
};
