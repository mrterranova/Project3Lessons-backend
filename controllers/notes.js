//import all the models that are required
const Notes = require('../models/Notes');
const Bookmark = require('../models/Bookmarked')
const User = require('../models/user')

//read all Notes 
exports.readNotes = (req, res) => {
    Notes.find({}).exec((err, allLessons) => {
        if (err) {
            return res.status(422).json({
                error: 'The Notes were not located'
            });
        }
        res.json(allLessons)
    })
}

//read a note by id
exports.readNote = (req, res) => {
    Notes.findOne({ _id: req.params.id }).exec((err, lesson) => {
        if (err) {
            return res.status(422).json({
                error: 'This note was not located'
            });
        }
        res.json(lesson)
    })
}

//post note through user id and lesson id
exports.postNote = (req, res) => {
    if (req.body._id != "") {
        Notes.findOne({ _id: req.body._id })
        .then(function (dbNote) {
            if (req.body.title === "") {
                req.body.title = dbNote.title
            }
            if (req.body.category === "") {
                req.body.category = dbNote.category
            }
            if (req.body.body === "") {
                req.body.body = dbNote.body
            }
            return Notes.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true });
        })
        .then(function (Notessmade) {
            res.json(Notessmade);
        })
        .catch(function (err) {
            console.log(err)
            res.json({ error: "There was an error in updating note." });
        });
} else {
Notes.create({
        User_id: req.body.User_id,
        Lesson_id: req.params.id,
        category: req.body.category,
        title: req.body.title,
        body: req.body.body
    })
        .then(function (dbNotes) {
            return User.findOneAndUpdate({ _id: req.body.User_id },
                { $push: { notes: dbNotes._id } }, { new: true });
        }).then(function (newusernotes) {
            res.json(newusernotes)
        }).catch(function () {
            res.status(422).json({ error: 'Could not post bookmark.' })
        })
    }
    
}


//update note by id
exports.updateNote = (req, res) => {
    console.log("UPDATE NOTE")
    Notes.findOne({ _id: req.params.id })
        .then(function (dbNote) {
            console.log("You are good")
            console.log(req.body)
            if (req.body.title === "") {
                req.body.title = dbNote.title
            }
            if (req.body.category === "") {
                req.body.category = dbNote.category
            }
            if (req.body.body === "") {
                req.body.body = dbNote.body
            }
            return Notes.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        })
        .then(function (Notessmade) {
            console.log(Notessmade)
            res.json(Notessmade);
        })
        .catch(function (err) {
            console.log(err)
            res.json({ error: "There was an error in updating note." });
        });
}

//delete note by id
exports.deleteNote = (req, res) => {
    Notes.findByIdAndRemove(req.params.id, (err, note) => {
        if (err) return err;
        res.status(200).json({ message: "Note was successfully deleted!" });
    });
}

//read 
exports.readBookmarks = (req, res) => {
    Bookmark.find({}).exec((err, allBookmarks) => {
        if (err) {
            return res.status(422).json({
                error: 'Bookmarked lessons not located.'
            });
        }
        res.json(allBookmarks)
    })
}

exports.readBookmark = (req, res) => {
    User.findOne({ _id: req.params.id })
        .populate('bookmarks')
        .exec((err, dblesson) => {
            if (err) {
                return res.status(422).json({
                    error: 'Bookmarked lesson not located.'
                });
            }
            res.json(dblesson)
        })
}

exports.postBookmark = (req, res) => {
    Bookmark.create({
        User_id: req.body.User_id,
        Lesson_id: req.params.id,
        lesson_title: req.body.lesson_title
    })
        .then(function (dbBookmark) {
            return User.findOneAndUpdate({ _id: req.body.User_id },
                { $push: { bookmarks: dbBookmark._id } }, { new: true });
        }).then(function (newuserbookmark) {
            res.json(newuserbookmark)
        }).catch(function (error) {
            res.status(422).json({ error: 'Could not post bookmark.' })
        })
}

exports.updateBookmark = (req, res) => {
    Bookmark.create(req.body)
        .then(function (dbNote) {
            return Bookmark.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        })
        .then(function (Bookmarksmade) {
            res.json(Bookmarksmade);
        })
        .catch(function () {
            res.json({ error: "There was an error in updating note." });
        });
}

exports.deleteBookmark = (req, res) => {
    Bookmark.findByIdAndRemove(req.params.id, (err, note) => {
        if (err) return err;
        console.log("Bookmark successfully deleted");
        res.status(200).json({ message: "Bookmark was successfully deleted!" });
    });
}