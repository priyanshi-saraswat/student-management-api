const mongoose = require('mongoose');

const practiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 25
  },
  course: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  }
});

const Practice = mongoose.model('Practice', practiceSchema);

module.exports = Practice;