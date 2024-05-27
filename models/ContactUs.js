const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const {contactUsMail} = require("../mail/templates/contactUsMail");

const contactUs = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// contactUs.post("save", async function(doc){
//     console.log("Doc:", doc);
//     try {
//         await contactMail(doc.name, doc.email)
//         console.log("Email sent successfully")
//     } catch (error) {
//         console.log("Network issue, Please try after sometimes")
//     }
// })

// async function contactMail(name, email) {
//     console.log("Hello")
//     try {
//         const mailResponse = await mailSender(
//             email,
//             "Inquiry/Feedback Submission - Acknowledgement",
//             contactUsMail(name)
//         )
//     } catch (error) {
//         console.log("Error occurred while sending mail")
//     }
// }

contactUs.post("save", async function (doc) {
  console.log("doc:", doc); // Moved inside the middleware function
  try {
    await contactMail(doc.name, doc.email);
  } catch (error) {
    alert("Network issue, Please try after sometimes");
  }
});

async function contactMail(name, email) {
  try {
    console.log("Enter in email section");
    const mailResponse = await mailSender(
      email,
      "Complaint Reviewed and Forwarding Confirmation",
      contactUsMail(name)
    );
  } catch (error) {
    console.log("Error occurred while sending feedback", error);
    throw error;
  }
}
module.exports = mongoose.model("ContactUs", contactUs);
