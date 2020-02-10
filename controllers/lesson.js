const Lessons = require('../models/Lessons'); 
const Curator = require('../models/Curator')


exports.readLessons = (req, res) => {
    Lessons.find({}).exec((err, allLessons) => {
        if (err) {
            return res.status(422).json({
                error: 'The Lessons were not located'
            });
        }
        res.json(allLessons)
    })
}

exports.readLesson = (req, res) => {
    Lessons.findOne({ _id: req.params.id })
    .populate("curatorNotes")
    .exec((err, lesson) => {
        if (err) {
            return res.status(422).json({
                error: 'This lesson was not located'
            });
        }
        res.json(lesson)
    })
}

exports.postLesson = (req, res) => {
    console.log("POST IT")
    console.log(req.body)
    
    Lessons.create(req.body, (err, lesson) => {
        if (err) {
            return res.status(422).json({
                error: 'Lesson could not post'
            })
        }
        res.status(200).json({
            message: "New lesson was posted!"
        })
    })
}

exports.updateLesson = (req, res) => {
    Lessons.findOneAndUpdate({ _id: req.params.id}, req.body).exec((err, lesson)=>{
        if (err) {
            return res(422).json({
                error: 'Lesson was unable to be updated.'
            })
        } 
        res.json(lesson);
    })
}

exports.deleteLesson = (req, res) => {
    Lessons.findOneAndDelete({ _id: req.params.id}).exec((err,lesson) => {
        if (err) {
            return res(422).json({
                error: 'The lesson was not able to be deleted.'
            })
        } 
        res.status(200).json({
            message: 'This lesson, '+req.body.title+', has been deleted.'
        })
    })
}

exports.readCuratorNotes = (req, res) => {
    Curator.find({}).exec((err, allNotes) => {
        if (err) {
            return res.status(422).json({
                error: 'The Lessons were not located'
            });
        }
        res.json(allNotes)
    })
}

exports.readCuratorNote = (req, res) => {
    Lessons.findOne({ _id: req.params.id })
    .populate('notes')
    .exec((err, dblesson) => {
        if (err) {
            return res.status(422).json({
                error: 'This lesson was not located'
            });
        }
        res.json(dblesson)
    })
}

exports.postCuratorNote = (req, res) => {
    Curator.create(req.body)
    .then(function(dbNotes) {
        return Lessons.findOneAndUpdate({ _id : req.params.id }, 
            { $push : { curatorNotes : dbNotes._id }}, { new : true });
    }).then(function(newlesson) {
        res.json(newlesson)
    }).catch (function(err){
        res.json(err)
    })
    
}

exports.updateCuratorNote = (req, res) => {
    console.log(req.params)
    Curator.create(req.body)
      .then(function(dbNote) {
        return Curator.findOneAndUpdate({ _id: req.params.id }, {
            location: req.body.location, 
            notes: req.body.notes, 
            highlights: req.body.highlights, 
            noteLocation: req.body.noteLocation
        }, { new: true });
      })
      .then(function(LessonNotes) {
        res.json(LessonNotes);
      })
      .catch(function(error) {
        res.json({ error : "There was an error in updating note."});
      });
}

exports.deleteCuratorNote = (req, res) => {
    console.log(req.params)
    Curator.findByIdAndRemove(req.params.id, (err, note) => {
        if (err) return err;
        console.log("Successfully deleted");
        res.status(200).json({message: "Note was successfully deleted!"});
    });
}