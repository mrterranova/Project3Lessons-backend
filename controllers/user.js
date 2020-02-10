const User = require('../models/user')
const Notes = require("../models/Notes")
const Bookmarked = require('../models/Bookmarked')

exports.read = (req, res) => {
    User.findOne({ _id: req.params.id })
    .populate("notes")
    .populate("bookmarks")
    .exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not located'
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user)
    })
}

exports.update = (req, res) => {

    const { name, password } = req.body;

    User.findOne({ _id: req.user._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not located'
            })
        }

        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            })
        } else {
            user.name = name;
        }
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be a minimum of 6 characters long'
                })
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err)
                return res(400).json({
                    error: 'User update has failed'
                })
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser)
        })
    })
}; 

exports.deleteUser = (req, res) => {
    User.delete({ _id: req.user.id}, err => {
        if (err) {
            return res(400).json({
                error: 'You are unable to delete user'
            })
        }
    })
}

exports.deleteUser = (req, res) => {
    User.delete({ _id: req.user.id}, err => {
        if (err) {
            return res(400).json({
                error: 'You are unable to delete this user'
            })
        }
    })
}

exports.getAll = (req, res) => {
    User.find({}), err => {
        if (err) {
            return res(400).json({
                error: 'Something happened to your Find All Users method'
            })
        }
    }
}


exports.updateAdmin = (req, res) => {
    const { name, password } = req.body;

    User.findOne({ _id: req.body._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not located'
            })
        }

        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            })
        } else {
            user.name = name;
        }
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be a minimum of 6 characters long'
                })
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err)
                return res(400).json({
                    error: 'User update has failed'
                })
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser)
        });
    });
}

exports.deleteUserByAdmin = (req, res) => {
    User.delete({ _id: req.body.id}, err => {
        if (err) {
            return res(400).json({
                error: 'You are unable to delete this user'
            })
        } 
    })
}

