//import the following node files
const express = require('express')
const router = express.Router();

//import controller
const { signup, accountActivation, signin, updatePassword, resetPassword, googleLogin, facebookLogin} = require('../controllers/auth')

//import validators
const { userSignupValidator, userSigninValidator, forgottenPasswordValidator, resetPasswordValidator } = require('../validators/auth')
const { runValidation } = require('../validators')


//routes for all authentication signing up/in features
router.post( '/signup', userSignupValidator, runValidation, signup );
router.post( '/activation', accountActivation );
router.post( '/signin', userSigninValidator, runValidation, signin );

//this is for forgotten passwords so can auth and send to email.
router.put('/update-password', forgottenPasswordValidator, runValidation, updatePassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);
// google and facebook routes
router.post('/google-login', googleLogin);
router.post('/facebook-login', facebookLogin);

//export all public and authenticated routes through router
module.exports = router;