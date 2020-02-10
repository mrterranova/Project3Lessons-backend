//import following through node
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create new instance of schema for bookmarked
const bookmarkedSchema = new Schema({
    // following fields included
  User_id: { 
      type: String, 
      required: true 
    }, 
  Lesson_id: { 
      type: String, 
      required: false 
    }, 
  lesson_title: { 
      type: String, 
      required: true 
    },
  date: { 
      type: Date, 
      default: Date.now 
    }
});

// create bookmarked datatable
const Bookmarked = mongoose.model("Bookmark", bookmarkedSchema);

// export model
module.exports = Bookmarked;