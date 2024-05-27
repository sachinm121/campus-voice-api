const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim : true
    },
    contactNumber:{
        type: String,
    },
    password:{
        type: String,
        required: true, 
    },
    role:{
        type: String,
        required: true,
        enum: ["Admin", "Student", "ServiceProvider"]
    },
    studentDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    serviceProviderDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider",
    },
    image:{
        type: String,
        required: true
    },
    token:{
        type: String,
    },
    resetPasswordExpires:{
        type: Date,
    },
}, {timestamps: true}
)

module.exports = mongoose.model("User", userSchema);


// Student: name, email, contactNumber, password, role, image, token, resetPasswordExpires, additional details: hostelName, roomNo,registrationNo, branch,Year
// Admin: name, email, contactNumber, password, role, image, token, resetPasswordExpires
// ServiceProvider name, email, contactNumber, password, role, image, token, resetPasswordExpires, serviceProviderRole