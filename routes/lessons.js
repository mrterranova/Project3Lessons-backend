//import the following node files
const express = require('express')
const router = express.Router();

//import controllers from the following
const { requireSignin, adminMiddleware } = require('../controllers/auth')
const { 
        readLessons, 
        readLesson, 
        postLesson, 
        updateLesson, 
        deleteLesson, 
        readCuratorNotes, 
        readCuratorNote, 
        postCuratorNote, 
        updateCuratorNote, 
        deleteCuratorNote 
    } = require('../controllers/lesson')

console.log("LESSONS ROUTES")       
//lesson routes
router.get('/lessons', readLessons);
router.get('/lesson/:id', readLesson); 
router.post('/admin/lesson/post', requireSignin, adminMiddleware, postLesson);
router.put('/admin/lesson/update/:id', requireSignin,  adminMiddleware, updateLesson );
router.delete('/admin/lesson/delete/:id', requireSignin, adminMiddleware, deleteLesson );

//curator routes
router.get( '/curator/notes', readCuratorNotes ); 
router.get( '/curator/notes/:id', readCuratorNote );
router.post( '/admin/lesson/post/:id', postCuratorNote );
router.put( '/curator/notes/:id', requireSignin, adminMiddleware, updateCuratorNote );
router.delete( '/curator/notes/:id', requireSignin, adminMiddleware, deleteCuratorNote );


//export the router with attached routes 
module.exports = router;