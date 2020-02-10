//import following through node
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create new instance of schema for lessons
const lessonsSchema = new Schema({
     // following fields included
  keyTerms: { 
    type: String, 
    required: true 
  }, 
  title: { 
    type: String, 
    required: true 
  }, 
  body: { 
    type: String, 
    required: true 
  },
  scriptures: { 
    type: String, 
    required: false 
  }, 
  audio: { 
    type: String, 
    required: false 
  },
  curatorNotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curator'
  }], 
  views: { 
    type: Number, 
    default: 0 
  }, 
  date: { 
    type: Date, 
    default: Date.now 
  }
});

// create lessons datatable
const Lessons = mongoose.model("Lessons", lessonsSchema);

// export model
module.exports = Lessons;
