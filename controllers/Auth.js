const User = require("../models/User");
const OTP = require("../models/OTP");
const Student = require("../models/Student");
const ServiceProvider = require("../models/ServiceProvider");
const otpGenerator = require("otp-generator");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const {uploadImageToCloudinary} = require("../utils/imageUploader")

require("dotenv").config();

// Send email for verification
exports.sendOTP = async (req, res) => {
  try {
    //Fetch data from request body
    const { email } = req.body;
    console.log(email);

    const domain = email.split('@')[1];
    const nitjsrDomain = "nitjsr.ac.in";

    // Verification
    if(domain !== nitjsrDomain){
        return res.status(400).json({
            success: false,
            message: "Not a student of NITJSR"
        })
    }

    // Find the use is already exist
    const checkUserPresent = await User.findOne({ email });

    // If user is already exist
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is already exist",
      });
    }

    // OTP generation
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // check otp unique or not
    let result = await OTP.findOne({ otp: otp });
    console.log("OTP", otp);
    console.log("Result", result);

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
    }

    const otpPayload = { email, otp };

    // create an entry of otp in db
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log("Error occurred while sending an otp");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    // fetch data from req body
    const {
      name,
      email,
      contactNumber,
      password,
      confirmPassword,
      role = "Student",
      otp,
    } = req.body;

    // Validations
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !contactNumber ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are mandetory",
      });
    }

    // Check both the password are same or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password not matched",
      });
    }

    // check user is already exist or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already registred",
      });
    }

    // find most recent otp
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    console.log("Recent otp: ", recentOtp);

    // validate otp
    if (recentOtp.length === 0) {
      // otp not found for this email
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    // hash password
    let hashedPassword = await bcrypt.hash(password, 10);

    const studentProfile = await Student.create({
      hostel: null,
      roomNo: null,
      registrationNo: null,
      branch: null,
      year: null,
    });

    let user = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      role: role,
      studentDetails: studentProfile,
      image: `http://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    });

    // if (role === "Student") {

    // } else if (role === "ServiceProvider") {
    //   const serviceProviderProfile = await ServiceProvider.create({
    //     serviceProviderRole: serviceProviderRole,
    //   })
    //   user = await User.findByIdAndUpdate(
    //     {_id: user._id},
    //     {serviceProviderDetails: serviceProviderProfile},
    //     {new: true}
    //   )
    // }

    // return response
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("Error occurred while signing up", error);
    return res.status(500).json({
      success: false,
      message: "User can not be registered, Please try again later",
    });
  }
};

exports.addNewUser = async (req, res) => {
  try {
    // fetch data from req body
    const {
      name,
      email,
      contactNumber,
      password,
      confirmPassword,
      role,
      serviceProviderRole,
      // otp,
    } = req.body;

    console.log("Req body:", req.body);

    // Validations
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !contactNumber
      // !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are mandetory",
      });
    }

    // Check both the password are same or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password not matched",
      });
    }

    // check user is already exist or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already registred",
      });
    }

    // find most recent otp
    // const recentOtp = await OTP.find({ email })
    //   .sort({ createdAt: -1 })
    //   .limit(1);

    // console.log("Recent otp: ", recentOtp);

    // // validate otp
    // if (recentOtp.length === 0) {
    //   // otp not found for this email
    //   return res.status(400).json({
    //     success: false,
    //     message: "OTP not found",
    //   });
    // } else if (otp !== recentOtp[0].otp) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "The OTP is not valid",
    //   });
    // }

    // hash password
    let hashedPassword = await bcrypt.hash(password, 10);

    // let serviceProviderProfile;
    // if(role === "ServiceProvider"){
    //   serviceProviderProfile = await ServiceProvider.create({
    //     serviceProviderRole: serviceProviderRole,
    //   })
    // }

    let user = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      role: role,
      image: `http://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    });

    if (role === "ServiceProvider") {
      // Create serviceProviderProfile
      const serviceProviderProfile = await ServiceProvider.create({
        serviceProviderRole: serviceProviderRole,
      });

      // Update user with serviceProviderProfile
      user = await User.findByIdAndUpdate(
        { _id: user._id }, // Use user._id to identify the user
        { serviceProviderDetails: serviceProviderProfile._id }, // Update serviceProviderRole field
        { new: true } // Ensure the updated document is returned
      );
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("Error occurred while signing up", error);
    return res.status(500).json({
      success: false,
      message: "User can not be registered, Please try again later",
    });
  }
};

// Login controller for authenticating user
exports.login = async (req, res) => {
  try {
    // fetch email and password from  req body
    const { email, password } = req.body;

    // check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are manadatory",
      });
    }

    // find user with provided email
    const user = await User.findOne({ email })
      .populate("serviceProviderDetails")
      .exec();

    console.log("User", user);

    // if user not found with provided email
    if (!user) {
      return res.status(401).json({
        // return 401 unautherized status code
        success: false,
        message: "User not registered, Please signup and continue",
      });
    }

    console.log("serviceProviderDetails:", user.serviceProviderDetails);

    // generate JWT token and password checking
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        image: user.image,
      };

      // Check if user is a ServiceProvider and if serviceProviderDetails is populated
      if (user.role === "ServiceProvider" && user.serviceProviderDetails) {
        payload.serviceProviderRole =
          user.serviceProviderDetails.serviceProviderRole;
      }

      // generating JWT
      const token = JWT.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24hr",
      });

      // save token in user document in db
      (user.token = token), (user.password = undefined);

      user.serviceProviderDetails = user.serviceProviderRole;

      // set cookie for token and return response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Pasword is wrong",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failure, please try later",
    });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    console.log("UserDetails", userDetails);
    const {
      contactNumber = "",
      image = "",
      hostel = "",
      roomNo = "",
      registrationNo = "",
      branch = "",
      year = "",
      serviceProviderRole = "",
    } = req.body;

    console.log("Data come from frontend:", req.body)

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User no found",
      });
    }

    console.log("File", req.files)

    // update profile

    let uploadedImage = ""; // Initialize image variable

    // Check if complaintImage exists in req.files
    if (req.files && req.files.image) {
      const profileImage = req.files && req.files.image;
      console.log("Profile image", profileImage);

      // Upload image to Cloudinary
      uploadedImage = await uploadImageToCloudinary(
        profileImage,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

      console.log("Upload image details", uploadedImage);
    }

    let StudentProfile;
    if (userDetails.role === "Student") {
      StudentProfile = await Student.findByIdAndUpdate(
        { _id: userDetails.studentDetails },
        {
          hostel: hostel ? hostel : "",
          roomNo: roomNo && roomNo,
          registrationNo: registrationNo && registrationNo,
          branch: branch && branch,
          year: year && year,
        },
        { new: true }
      );
    }

    let SPProfile;
    if (userDetails.role === "ServiceProvider") {
      SPProfile = await ServiceProvider.findByIdAndUpdate(
        { _id: userDetails.serviceProviderDetails },
        {
          serviceProviderRole: serviceProviderRole,
        },
        { new: true }
      );
    }

    let updatedUser;
      updatedUser = await User.findByIdAndUpdate(
        { _id: userDetails._id },
        { 
          contactNumber: contactNumber ? contactNumber : userDetails.contactNumber,
          image: uploadedImage ? uploadedImage.secure_url : userDetails.image
        },
        { new: true }
      )
        .populate("studentDetails")
        .populate("serviceProviderDetails")
        .exec();

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
      updatedUser,
      StudentProfile,
      SPProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserDetails = async(req, res) => {
  try {
    console.log("req body", req.body)
    const {id, role} = req.body;

    if(!id){
      return res.status(404).json({
        success: false,
        message: "User id missing"
      })
    }

    let userDetails;

    if(role === "Student"){
      userDetails = await User.findById({_id:id}).populate("studentDetails");
    }
    else if(role === "ServiceProvider"){
      userDetails = await User.findById({_id:id}).populate("serviceProviderDetails");
    }
    else{
      userDetails = await User.findById({_id:id})
    }

    if(!userDetails){
      return res.status(404).json({
        success: false,
        message: "User details not found"
      })
    }


    return res.status(200).json({
      success: true,
      message: "User details found",
      userDetails
    })
  } catch (error) {
    console.log(error)
  }
}

exports.findUserDetails = async(req, res) => {
  try {
    const {email} = req.body;

    if(!email){
      return res.status(401).json({
        success: false,
        message: "Fields is Required"
      })
    }

    const userDetails = await User.findOne({email});

    if(!userDetails){
      return res.status(401).json({
        success: false,
        message: "User not Found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "User Details Found",
    })
  } catch (error) {
      console.log("Error occurred while finding user details")
  }
}

// exports.changePassword = async (req, res) => {
//   try {
//     // Fetch user data from req.user
//     const userDetails = await User.findById(req.user.id);
//     console.log("UserDetails", userDetails);

//     // fetch old password, newPassword, confirmNewPassword
//     const { oldPassword, newPassword, confirmNewPassword } = req.body;

//     // match old password and database password
//     const isPasswordMatch = await bcrypt.compare(
//       oldPassword,
//       userDetails.password
//     );

//     if (!isPasswordMatch) {
//       // if old password does not match, return a 401 (unauthorized)
//       return res.status(401).json({
//         success: false,
//         message: "Old password not matched",
//       });
//     }

//     // match new password and confirm new password
//     if (newPassword !== confirmNewPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "New Password and Comfirm New Password not matched",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     const updatedUserDetails = await User.findByIdAndUpdate(
//       req.user.id,
//       { password: hashedPassword },
//       { new: true }
//     );

//     // Send mail - password updated
//     try {
//       const emailResponse = await mailSender(
//         updatedUserDetails.email,
//         "Password update",
//         passwordUpdated(
//           updatedUserDetails.email,
//           `Password updated successfully for ${updatedUserDetails.name}`
//         )
//       );
//       console.log("Email send successfully", emailResponse.response);
//     } catch (error) {
//       // If there is an error sanding the email, log the error and return 500 (Internal Server Error)
//       return res.status(500).json({
//         success: false,
//         message: "Error occurred while sending email failed",
//         error: error.message,
//       });
//     }

//     // return response
//     return res.status(200).json({
//       success: true,
//       message: "Password updated successfully",
//     });
//   } catch (error) {
//     console.error("Error occurred while sending email log", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error occurred while sending email 500",
//       error: error.message,
//     });
//   }
// };

// {
//     "name": "sachin",
//     "email": "simmijain1101@gmail.com",
//     "password": "123456",
//     "confirmPassword": "123456",
//     "role": "Student",
//     "contactNumber": "8899754868",
//     "otp": "448612"
// }
