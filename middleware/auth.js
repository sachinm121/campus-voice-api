const JWT = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async(req, res, next) => {
    try {
        // const token = req.body.token || req.cookies.token || (req.header("Authorisation") || "").replace("Bearer", "").trim();
        const token = req.body.token || req.cookies.token || (req.header("Authorization") || "").replace("Bearer", "").trim();



        // if token is missing
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        //  verify the token
        try {
            const decode = JWT.verify(token, process.env.JWT_SECRET);
            console.log("token",decode)
            req.user = decode;
        } catch (error) {
            // verification issue
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            })
        }
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifing token"
        })
    }
}

// isStudent
exports.isStudent = async(req, res, next) => {
    try {
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Student"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "This person is not a Student"
        })
    }
}

// isServiceProvider
exports.isServiceProvider = async(req, res, next) => {
    try {
        if(req.user.role !== "ServiceProvider"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for ServiceProvider"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "This person is not ServiceProvider"
        })
    }
}

//isAdmin

exports.isAdmin = async(req, res, next) => {
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Admin",
            })
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "This person is not a Admin"
        })
    }
}