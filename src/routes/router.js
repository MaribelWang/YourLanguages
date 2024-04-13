const express = require('express');
const router = express.Router();

// Route middlewares
const checkSession = require('../middlewares/check-session');
const { loginValidations, signUpValidations } = require('../middlewares/validations');
const upload = require('../middlewares/upload');

// Controllers
const authController = require('../controllers/authController');

// Auth routes
router.get('/', authController.goToHome);
router.get('/login-form', authController.goToLogin);
router.get('/log-out', authController.logOut);
router.delete('/delete-account/:id', authController.deleteUserById);
router.post('/login', loginValidations, authController.login);
router.get('/register-form', authController.goToSignUpForm);
router.post('/register-form/create', upload.single('avatar'), signUpValidations, authController.signUp);
//router.get('/edit-profile/:id', authController.editUserById);
//singUpValidations,
module.exports = router;