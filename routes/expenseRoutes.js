const express = require('express');
const {
  addExpense,
  getExpensesByDate,
  getExpensesByWeek,
  getExpensesByMonth,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add', authMiddleware, addExpense);
router.get('/day', authMiddleware, getExpensesByDate);
router.get('/week', authMiddleware, getExpensesByWeek);
router.get('/month', authMiddleware, getExpensesByMonth);
router.put('/:id', authMiddleware, updateExpense);
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;
