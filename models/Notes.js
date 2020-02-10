//import following through node
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create new schema for notes
const notesSchema = new Schema({
    // following fields included
  Lesson_id: {
      type: String, 
      required: true
  },
  User_id: {
      type: String, 
      required: true
  },
  category: {
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
  date: { 
      type: Date, 
      default: Date.now 
    }
});

// create notes datatable
const Notes = mongoose.model("Note", notesSchema);

// export model
module.exports = Notes;