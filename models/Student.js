const mongoose = require("mongoose");

const student = new mongoose.Schema({
    hostel: {
        type: String,
        trim : true
    },
    roomNo: {
        type: String,
        trim: true,
    },
    registrationNo:{
        type: String,
        trim: true,
    },
    branch:{
        type: String,
        trim: true 
    },
    year:{
        type: String,
        trim: true
    }
})

module.exports = mongoose.model("Student", student);