//import following through node
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create new instance of schema for lessons
const frontPageSchema = new Schema({
     // following fields included
  keyTerms: { 
    type: String, 
    required: true 
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
const FrontPage = mongoose.model("Lessons", frontPageSchema);

// export model
module.exports = FrontPage;
