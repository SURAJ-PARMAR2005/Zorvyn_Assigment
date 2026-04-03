const {body} = require("express-validator");

const validateRecord = [
  body('amount')
    .notEmpty()
    .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),

  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['income', 'expense']),

  body('category')
    .notEmpty(),
    // .trim(),

  body('date')
    .optional()
    .isISO8601(),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];


module.exports = {validateRecord}