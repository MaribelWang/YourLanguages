const { check } = require('express-validator');
const loginValidations = [
    check('email')
    .notEmpty().withMessage('Enter an email').bail()
    .isEmail().withMessage('Enter a valid email').bail(),
    check('password')
    .notEmpty().withMessage('Enter a password').bail()
]

const signUpValidations = [
    check('email')
    .notEmpty().withMessage('Enter an email').bail()
    .isEmail().withMessage('Enter a valid email').bail(),
    check('password')
    .notEmpty().withMessage('The password can not be empty').bail()
    .isStrongPassword({minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1})
    .withMessage('Password must have at least 8 characters, uppercase/lowercase and and at least one number and one symbol')
]

module.exports = { loginValidations, signUpValidations }