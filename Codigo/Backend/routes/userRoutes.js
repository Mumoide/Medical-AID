const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Import userController
const authenticateToken = require('../middleware/authenticateToken'); // Correct path to middleware
const authenticateUser = require('../middleware/authenticateUser')

// POST route to register a new user
router.post('/register', userController.registerUser); // Use registerUser method
// Route to handle user login
router.post('/login', userController.loginUser); // Use loginUser method
// Route to retrieve all users and their roles
router.get('/users', authenticateToken, userController.getAllUsers);
// Route to handle logical deletion of a user
router.delete('/:id_user', authenticateToken, userController.deleteUser);
// Route to handle the reactivation of a user
router.put('/reactivate/:id_user', authenticateToken, userController.reactivateUser);
// Route to get user data by user_id
router.get('/:id', authenticateToken, userController.getUserById);
// Route to update profile
router.put('/profile', authenticateUser, userController.updateProfile);
// Route to update user data by user_id
router.put('/:id', authenticateToken, userController.updateUser);
// Route to register an admin user
router.post('/register-admin', authenticateToken, userController.registerAdmin);
// Route to logout user
router.post('/logout', userController.logoutUser);
// Route to change password of user
router.post('/update-password', authenticateToken, userController.changePassword)

module.exports = router;
