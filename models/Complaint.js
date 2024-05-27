const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const { complaintSubmission } = require("../mail/templates/complaintSubmission");
const User = require("../models/User");
const { complaintAccepted } = require("../mail/templates/complaintAccepted");
const { complaintRejected } = require("../mail/templates/complaintRejected");
const { complaintSolved } = require("../mail/templates/complaintSolved");

const complaintSchema = new mongoose.Schema({
    complaintType:{
        type: String,
        enum: ["Maintenance", "Safety and Security", "Food"],
        required: true
    },
    complaint:{
        type: String,
        required: true 
    },
    complaintImage:{
        type: String,
    },
    status:{
        type: String,
        enum: ["Pending","Processing", "Solved", "Rejected"],
        default: "Pending",
    },
    sid:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    feedback:{
        type: String,
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        required: true,
        default: Date.now,
    },
})


async function createComplaint(name,email,complaintId){
    try {
        console.log("Enter in email section");
        const mailResponse = await mailSender(
            email,
            "Complaint Submitted Successfully",
            complaintSubmission(name,complaintId)
        )
    } catch (error) {
        console.log("Error occurred while creating complaint", error)
        throw error
    }
}

complaintSchema.post("save", async function(doc){
    console.log("doc:", doc); // Moved inside the middleware function
    try {
        const userDetails = await User.findById(doc.sid);
        if(userDetails){
            await createComplaint(userDetails.name,userDetails.email, doc._id)
        }
        else{
            console.log("User not found");
        }
    } catch (error) {
        alert("Network issue, Please try after sometimes");
    }
});

async function acceptComplaint(name,email,complaintId){
    try {
        console.log("Enter in email section");
        const mailResponse = await mailSender(
            email,
            "Complaint Reviewed and Forwarding Confirmation",
            complaintAccepted(name,complaintId)
        )
    } catch (error) {
        console.log("Error occurred while creating complaint", error)
        throw error
    }
}

// complaintSchema.post("findOneAndUpdate", async function(doc){
//     // complaintAccepted
//     console.log("doc:", doc); // Moved inside the middleware function
//     try {
//         const userDetails = await User.findById(doc.sid);
//         if(userDetails){
//             await acceptComplaint(userDetails.name,userDetails.email, doc._id)
//         }
//         else{
//             console.log("User not found");
//         }
//     } catch (error) {
//         alert("Network issue, Please try after sometimes");
//     }
// })



async function rejectComplaint(name,email,complaintId){
    try {
        console.log("Enter in email section");
        const mailResponse = await mailSender(
            email,
            "Complaint Reviewed and Forwarding Confirmation",
            complaintRejected(name,complaintId)
        )
    } catch (error) {
        console.log("Error occurred while creating complaint", error)
        throw error
    }
}
async function solveComplaint(name,email,complaintId){
    try {
        console.log("Enter in email section");
        const mailResponse = await mailSender(
            email,
            "Complaint Reviewed and Forwarding Confirmation",
            complaintSolved(name,complaintId)
        )
    } catch (error) {
        console.log("Error occurred while creating complaint", error)
        throw error
    }
}

complaintSchema.post("findOneAndUpdate", async function(doc){
    // complaintAccepted
    console.log("doc:", doc); // Moved inside the middleware function
    try {
        const userDetails = await User.findById(doc.sid);
        if(userDetails && doc.status === "Rejected"){
            await rejectComplaint(userDetails.name,userDetails.email, doc._id)
        }
        else if(userDetails && doc.status === "Processing"){
            await acceptComplaint(userDetails.name,userDetails.email, doc._id)
        }
        else{
            await solveComplaint(userDetails.name,userDetails.email, doc._id);
        }
    } catch (error) {
        alert("Network issue, Please try after sometimes");
    }
})




module.exports = mongoose.model("Complaint", complaintSchema);