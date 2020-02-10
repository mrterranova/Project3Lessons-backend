//import the following from node
const { check } = require("express-validator")

//Signup Validation.
exports.userSignupValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'), 
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'), 
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
]

//Sign in validation. 
exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'), 
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
]

// forgotten password validation.
exports.forgottenPasswordValidator = [
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Must be a valid email address'), 
]

// reset password validation
exports.resetPasswordValidator = [
    check('newPassword')
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
]