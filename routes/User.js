// Import the required module 
const express = require("express");
const router = express.Router();

// import the required controllers and middleware
const { login, signUp, addNewUser, sendOTP,updateProfile, changePassword, getUserDetails, findUserDetails } = require("../controllers/Auth");


const {auth, isAdmin, isStudent} = require("../middleware/auth");
const Student = require("../models/Student");

// Routes for login, signup, and authentication

// **************Authentication routes Start********************

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signUp);

// Route for add new user
router.post("/addnewuser",auth, isAdmin, addNewUser);

router.post("/profileupdate",auth, updateProfile);

router.post("/studentprofileupdate",auth, isStudent, updateProfile);

// Route for sending mail to the user's email
router.post("/sendotp", sendOTP);

// Route for change password
// router.post("/changepassword", auth, changePassword)

// Router for user details
router.post("/userdetails", getUserDetails);

// Router for finding user details by admin
router.get("/finduserdetails",findUserDetails)

module.exports = router

// **************Authentication routes End**********************