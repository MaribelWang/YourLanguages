const express = require('express');
const router = express.Router();

//Route middlewares
const upload = require('../middlewares/upload');
const checkSession = require('../middlewares/check-session');
const { logInValidations, signUpValidations } = require('../middlewares/validations');

//controllers
const authController = require('../controllers/AuthController');
const tutorsController = require('../controllers/TutorsController');

//tutors routes
router.get('/',tutorsController.goToHome);
router.get('/teacher-form',tutorsController.goToTutorsForm);
router.post('/teacher-form/create', upload.single('avatar'),tutorsController.createTutors);
router.get('/teacher-form/:id/edit',tutorsController.goToEditForm);
router.put('/teacher-form/:id/edit',upload.single('avatar'), tutorsController.editTutorsById);
router.delete('/teacher-form/:id/delete',tutorsController.deleteTutors);

//Auth routes
router.get('/login-form',authController.goToLogin);
router.get('/log-out',authController.logOut);
router.delete('/delete-account/:id',authController.deleteUserAccountById);
router.post('/login',logInValidations,authController.login);
router.get('/register-form',authController.goToSignUpForm);
router.post('/register-form/create',signUpValidations,authController.signUp);


module.exports = router;