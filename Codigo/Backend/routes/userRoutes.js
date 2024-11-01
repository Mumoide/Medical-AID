const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Import userController

// POST route to register a new user
router.post('/register', userController.registerUser); // Use registerUser method
// Route to handle user login
router.post('/login', userController.loginUser); // Use loginUser method
// Route to retrieve all users and their roles
router.get('/users', userController.getAllUsers);
// Route to handle logical deletion of a user
router.delete('/:id_user', userController.deleteUser);
// Route to handle the reactivation of a user
router.put('/reactivate/:id_user', userController.reactivateUser);
// Route to get user data by user_id
router.get('/:id', userController.getUserById);
// Route to update user data by user_id
router.put('/:id', userController.updateUser);
// Route to register an admin user
router.post('/register-admin', userController.registerAdmin);
// Route to logout user
router.post('/logout', userController.logoutUser);
module.exports = router;
