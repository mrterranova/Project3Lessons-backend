//import the following and send to 
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require("express-jwt")
const _ = require('lodash')
const { OAuth2Client } = require('google-auth-library')
const fetch = require('node-fetch')

const sendgridMail = require("@sendgrid/mail")
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)


//commented out selection in case want to bypass sending email through sendgrid

// exports.signup = (req,res) => {
//     // console.log('REQ BODY ON SIGNUP', req.body)
//     const { name, email, password } = req.body

//     User.findOne({ email }).exec((err, user)=> {
//         if(user) {
//             return res.status(400).json({
//                 error: 'Email is taken'
//             })
//         }
//     })
//     let newUser = new User({ name, email, password })

//     newUser.save((err, success) => {
//         if(err) {
//             console.log('SIGNUP ERROR', err)
//             return res.status(400).json({ 
//                 error : err
//             })
//         }
//         res.json({
//              message: 'Signup success! Please signin!'
//         })
//     })
// }

//signup with email activation
exports.signup = (req, res) => {
    const { name, email, password } = req.body

    //find user by email. All emails must be unique
    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            })
        }

        //send a token for email activation
        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '30m' })

        // email message uses the following format for sendgrid
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Account activation link - Words of Glory',
            html:
                '<h1>Thank you for signing up with Words of Glory</h1>' +
                '<p>To activate your account, please use the following link:</p>' +
                '<br/>' +
                '<p>' + process.env.CLIENT_URL + '/auth/activate/' + token + '</p>' +
                '<hr />' +
                '<p>This email may contain sensitive information</p>' +
                '<p>' + process.env.CLIENT_URL + '</p>'
        }
        //sendgrid email send and message
        sendgridMail.send(emailData).then(sent => {
            return res.json({
                message: `An Email has been sent to ${email}. Please follow the instructions.`
            })
        }).catch(err => {
            return res.json({
                message: err.message
            })
        })
    });
};

// activate the account through email token
exports.accountActivation = (req, res) => {
    //deconstruct req.body in token
    const { token } = req.body
    //verify token with any errors included
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decode) {
            if (err) {
                console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err)
                return res.status(401).json({
                    error: 'Expired link. You will need to Signup once more'
                })
            }

            // deconstruct user info through the token
            const { name, email, password } = jwt.decode(token)

            // create new instance of user with the following fields
            const user = new User({ name, email, password })

            //allow user activation to be saved
            user.save((err, user) => {
                if (err) {
                    console.log("Save user in account activation error", err)
                    return res.status(401).json({
                        error: 'Error saving user to database. Try signing up again.'
                    })
                }
                return res.json({
                    message: 'You have successfully signed up!'
                });
            })
        })
    } else {
        return res.json({
            message: 'An error has occurred. Please try signing up again.'
        })
    }
};

//signin handling with token through jwt
exports.signin = (req, res) => {
    //
    const { email, password } = req.body

    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. You will need to sign up.'
            })
        }
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Password and email do not match'
            })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '14d' });
        const { _id, name, email, role } = user

        return res.json({
            token,
            user: { _id, name, email, role }
        })
    });
};

// this makes a user request object to all tokens this is applied to. 
//  Private routing on the back-end, blocks all that isn't private route.
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET
})

//admin middleware authentication
exports.adminMiddleware = (req, res, cb) => {
    User.findById({ _id: req.user._id }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not located'
            })
        }
        if (user.role != 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access denied'
            })
        }

        req.profile = user;
        cb();
    })
}

exports.updatePassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist'
            });
        }

        const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_RESET_PASSWORD, { expiresIn: '30m' });

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password Reset link`,
            html: '<h1>From Words of Glory at No Limits Ministries: </h1>' +
                '<p>To reset your password, please use the following link:</p>' +
                '<br/>' +
                '<p><a href="' + process.env.CLIENT_URL + '/auth/password/reset/' + token + '">CLICK HERE TO ACTIVATE LINK</a></p>' +
                '<hr />' +
                '<p>This email may contain sensitive information</p>' +
                '<p>' + process.env.CLIENT_URL + '</p>'
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                console.log('RESET PASSWORD LINK ERROR', err);
                return res.status(400).json({
                    error: 'Database connection error on user password forgot request'
                });
            } else {
                sendgridMail
                    .send(emailData)
                    .then(sent => {
                        // console.log('SIGNUP EMAIL SENT', sent)
                        return res.json({
                            message: 'Email has been sent to ' + email + '. Follow the instruction to activate your account'
                        });
                    })
                    .catch(err => {
                        // console.log('SIGNUP EMAIL SENT ERROR', err)
                        return res.json({
                            message: err.message
                        });
                    });
            }
        });
    });
};

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
            if (err) {
                return res.status(400).json({
                    error: 'This Link has expired'
                });
            }

            User.findOne({ resetPasswordLink }, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: 'Something went wrong. Try later'
                    });
                }

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updatedFields);

                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'An error has occurred when reseting your password'
                        });
                    }
                    res.json({
                        message: 'You can now signin with new password'
                    });
                });
            });
        });
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
    const { idToken } = req.body;

    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(response => {
        // console.log('GOOGLE LOGIN RESPONSE',response)
        const { email_verified, name, email } = response.payload;
        if (email_verified) {
            User.findOne({ email }).exec((err, user) => {
                if (user) {
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '14d' });
                    const { _id, email, name, role } = user;
                    return res.json({
                        token,
                        user: { _id, email, name, role }
                    });
                } else {
                    let password = email + process.env.JWT_SECRET;
                    user = new User({ name, email, password });
                    user.save((err, data) => {
                        if (err) {
                            console.log('ERROR WITH GOOGLE LOGIN', err);
                            return res.status(400).json({
                                error: 'Google can not login user currently'
                            });
                        }
                        const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '14d' });
                        const { _id, email, name, role } = data;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    });
                }
            });
        } else {
            return res.status(400).json({
                error: 'Google login has failed. Please try again.'
            });
        }
    });
};

exports.facebookLogin = (req, res) => {
    const { userID, accessToken } = req.body;

    const url = 'https://graph.facebook.com/v2.11/'+userID+'/?fields=id,name,email&access_token='+accessToken;

    return (
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            // .then(response => console.log(response))
            .then(response => {
                const { email, name } = response;
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '14d' });
                        const { _id, email, name, role } = user;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    } else {
                        let password = email + process.env.JWT_SECRET;
                        user = new User({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('error saving user', err);
                                return res.status(400).json({
                                    error: 'Login failed with facebook'
                                });
                            }
                            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '14d' });
                            const { _id, email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, name, role }
                            });
                        });
                    }
                });
            })
            .catch(error => {
                res.json({
                    error: 'Login through Facebook failed. Please try again'
                });
            })
    );
};