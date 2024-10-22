const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Adjust the path if necessary

// POST: Create a new admin (Register)
router.post('/register', adminController.createAdmin);

// GET: Retrieve an admin by ID
router.get('/:id', adminController.getAdminById);

// PUT: Update an admin's details
router.put('/:id', adminController.updateAdmin);

// DELETE: Delete an admin by ID
router.delete('/:id', adminController.deleteAdmin);

// POST: Sign in (Login)
router.post('/login', adminController.signIn);

module.exports = router;
