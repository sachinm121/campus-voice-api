const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");


const OTPSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true, 
    },
    otp:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 5*60, // The document will be automatically deleted after 5 min of it's creation
    }
})

// Define a function -> to send a mail
async function sendVerificationEmail(email, otp){
    // create a transporter to send emails

    // Define the email options

    // Send the email

    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email from NIT Complaint System",
            emailTemplate(otp)
        )
    } catch (error) {
        console.log("Error occurred while sending email", error);
        throw error
    }
}

// Define a pre-save hook to send email after the document has been saved
OTPSchema.pre("save", async function(next){
    console.log("New document saved to database");

    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
})

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;