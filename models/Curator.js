//import following through node
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create new instance of schema for curator
const curatorSchema = new Schema({
    // following fields included
  location: { 
      type: String, 
      required: true 
    }, 
  notes: { 
      type: String, 
      required: true 
    },
  highlights: { 
      type: String, 
      required: false 
    }, 
  noteLocation: { 
      type: String, 
      required: true 
    },
  date: { 
      type: Date, 
      default: Date.now 
    }
});

// create curator datatable
const Curator = mongoose.model("Curator", curatorSchema);

// export model
module.exports = Curator;