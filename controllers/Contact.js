const ContactUs = require("../models/ContactUs");

exports.contactUs = async (req, res) => {
    try {
        const {name, email,message} = req.body;

        if(!name || !email || !message){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        const response = await ContactUs.create({
            name,
            email,
            message
        })

        return res.status(200).json({
            success: true,
            message: "Thank you for contacting us",
            response
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Network issue, White creating contact us data"
        })
    }
}