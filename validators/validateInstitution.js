const { body, validationResult } = require('express-validator');

module.exports = [
  body('adminId').notEmpty().withMessage('adminId is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('keyNumber').isLength({ min: 6 }).withMessage('Key must be at least 6 characters'),
  
  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
