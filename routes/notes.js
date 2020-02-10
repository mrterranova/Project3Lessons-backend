//import the following node files
const express = require('express')
const router = express.Router();

//import controllers from the following
const { requireSignin, adminMiddleware } = require('../controllers/auth')

const { 
        //USER NOTES
        readNotes, 
        readNote, 
        postNote, 
        updateNote, 
        deleteNote, 
        //USER BOOKMARKS
        readBookmarks,  
        readBookmark, 
        postBookmark, 
        updateBookmark, 
        deleteBookmark

    } = require('../controllers/notes')

//notes routes
router.get('/notes', requireSignin, readNotes ); 
router.get('/notes/:id', requireSignin, readNote); 
router.post('/user/note/:id', requireSignin, postNote ); 
router.put('/notes/:id', requireSignin, updateNote ); 
router.delete('/notes/:id', requireSignin, deleteNote ); 

//bookmark routes
router.get( '/bookmarks', requireSignin, readBookmarks ); 
router.get( '/bookmarks/:id', requireSignin, readBookmark ); 
router.post( '/user/bookmarks/:id', requireSignin, postBookmark); 
router.put( '/bookmarks/:id', requireSignin, updateBookmark ); 
router.delete( '/bookmarks/:id', requireSignin, deleteBookmark ); 


//export the router with attached routes 
module.exports = router;