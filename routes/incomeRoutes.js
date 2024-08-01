const express = require('express');
const {
  addIncome,
  getIncomesByDate,
  getIncomesByWeek,
  getIncomesByMonth,
  updateIncome,
  deleteIncome
} = require('../controllers/incomeController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/add', authMiddleware, addIncome);
router.get('/day', authMiddleware, getIncomesByDate);
router.get('/week', authMiddleware, getIncomesByWeek);
router.get('/month', authMiddleware, getIncomesByMonth);
router.put('/:id', authMiddleware, updateIncome);
router.delete('/:id', authMiddleware, deleteIncome);

module.exports = router;
