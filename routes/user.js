//import the following node files
const express = require('express')
const router = express.Router();

//import controllers from the following
const { requireSignin, adminMiddleware } = require('../controllers/auth')
const { read, update, deleteUser, getAll, updateAdmin, deleteUserByAdmin } = require('../controllers/user')

//user routes with correct authentication
router.get('/user/:id', requireSignin,  read );
router.put('/user/update', requireSignin,  update );
router.delete('/user/delete/:id', requireSignin, deleteUser );

//administration routes with correct authentication + admin middleware
router.get('admin/user', requireSignin, adminMiddleware, getAll );
router.put('/admin/update', requireSignin,  adminMiddleware, updateAdmin );
router.delete('/admin/user/delete/:id', requireSignin, adminMiddleware, deleteUserByAdmin)

//export the router with attached routes 
module.exports = router;