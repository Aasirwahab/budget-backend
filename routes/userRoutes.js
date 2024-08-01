const express = require('express');
const { registerController, loginController, userController, logoutController } = require('../controllers/user Controller'); // Corrected file name
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/user', authMiddleware, userController);  // Protected route to get user details
router.post('/logout', authMiddleware, logoutController);  // Logout route
module.exports = router;
