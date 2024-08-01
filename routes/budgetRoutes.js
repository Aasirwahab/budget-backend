const express = require('express');
const { addBudget, getBudgetByMonth } = require('../controllers/budgetController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/add', authMiddleware, addBudget);
router.get('/month', authMiddleware, getBudgetByMonth);

module.exports = router;
