const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const { complaintType, complaint } = req.body;

    let image = ""; // Initialize image variable

    // Check if complaintImage exists in req.files
    if (
      req.files &&
      req.files &&
      req.files["complaintImage[fileList][0][originFileObj]"]
    ) {
      const complaintImage =
        req.files["complaintImage[fileList][0][originFileObj]"];
      console.log("Complaint image", complaintImage);

      // Upload image to Cloudinary
      image = await uploadImageToCloudinary(
        complaintImage,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

      console.log("Upload image details", image);
    }
    // Fetch student details
    const studentDetails = await User.findOne({ _id: req.user.id });
    console.log("Student details: ", studentDetails);

    // Check if there's any pending complaint of the same type
    const pendingComplaint = await Complaint.find({
      complaintType,
      sid: studentDetails._id,
    });

    if (pendingComplaint.length == 3) {
      return res.status(400).json({
        success: false,
        message: "Student Can not submit more than 3 complaints of same type",
      });
    }

    // Create complaint
    const response = await Complaint.create({
      complaintType,
      complaint,
      complaintImage: image ? image.secure_url : "",
      sid: studentDetails._id,
    });

    // Populate complaint details with student information
    const complaintDetails = await Complaint.findById(response._id).populate(
      "sid"
    );

    // Remove password from student details
    complaintDetails.sid.password = undefined;

    // Return response
    return res.status(200).json({
      success: true,
      message: "Complaint submitted successfully",
      complaintDetails,
    });
  } catch (error) {
    console.log("Error occurred while submitting", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update complaint
exports.updateComplaint = async (req, res) => {
  try {
    const { complaintId, complaintType, complaint } = req.body;
    console.log("Data come from frontend", req.body);
    // Validation
    if (!complaintId) {
      return res.status(400).json({
        success: true,
        message: "All fields are mandatory",
      });
    }

    // Find complaint details by ID
    const complaintDetails = await Complaint.findById({ _id: complaintId });

    // console.log("Complaint",complaintDetails)

    if (!complaintDetails) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    console.log("File", req.files);

    let image = ""; // Initialize image variable

    // Check if complaintImage exists in req.files
    if (
      req.files &&
      req.files &&
      req.files["complaintImage[fileList][0][originFileObj]"]
    ) {
      const complaintImage =
        req.files["complaintImage[fileList][0][originFileObj]"];
      console.log("Complaint image", complaintImage);

      // Upload image to Cloudinary
      image = await uploadImageToCloudinary(
        complaintImage,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

      console.log("Upload image details", image);
    }

    // Update complaint
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      { _id: complaintId },
      {
        complaintType: complaintType
          ? complaintType
          : complaintDetails.complaintType,
        complaint: complaint ? complaint : complaintDetails.complaint,
        complaintImage: image
          ? image.secure_url
          : complaintDetails.complaintImage,
      },
      { new: true }
    );

    // Return response
    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      updatedComplaint,
    });
  } catch (error) {
    console.log("Error occurred while updating complaint", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.body;

    // Validation
    if (!complaintId) {
      return res.status(400).json({
        success: true,
        message: "Complaint ID is mandatory",
      });
    }

    // Find complaint details by ID
    const complaintDetails = await Complaint.findById(complaintId);

    if (!complaintDetails) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Delete complaint
    await Complaint.findByIdAndDelete({ _id: complaintId });

    // Return response
    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.log("Error occurred while deleting complaint", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get student complaints
exports.getStudentComplaint = async (req, res) => {
  try {
    // Fetch student ID
    const sid = req.user.id;

    // Validation
    if (!sid) {
      return res.status(401).json({
        success: false,
        message: "Complaint",
      });
    }

    // Find all complaints of the student and populate with student details
    const complaints = await Complaint.find({ sid: sid }).populate({
      path: "sid",
      populate: {
        path: "studentDetails",
      },
    });

    return res.status(200).json({
      success: true,
      message: `Fetched all complaints of the student`,
      complaints,
    });
  } catch (error) {
    console.log("Error occurred while deleting complaint", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.changeComplaintStatusByAdmin = async (req, res) => {
  try {
    const { complaintId } = req.body;

    // fetch user id
    const Aid = req.user.id;
    const { status } = req.body;

    // validation
    if (!Aid) {
      return res.status(401).json({
        success: false,
        message: "Admin id not found",
      });
    }

    const updatedStatusComplaint = await Complaint.findByIdAndUpdate(
      { _id: complaintId },
      { status: status },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Status updated successfully by Admin",
      updatedStatusComplaint,
    });
  } catch (error) {
    console.log("Error occurred while changing pending status by Admin", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getAdminComplaints
exports.getAdminComplaints = async (req, res) => {
  try {
    // fetch all complaint
    const complaints = await Complaint.find({}).populate("sid");
    // return response
    return res.status(200).json({
      success: true,
      message: "All complaint fetched",
      complaints,
    });
  } catch (error) {
    console.log("Error occurred while fetching all complaints");
  }
};

// update status by service provider
exports.changeComplaintStatusByServiceProvider = async (req, res) => {
  try {
    const { complaintId } = req.body;

    const updatedStatusComplaint = await Complaint.findByIdAndUpdate(
      { _id: complaintId },
      { status: "Solved" },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Status updated successfully by Service Provider",
      updatedStatusComplaint,
    });
  } catch (error) {
    console.log(
      "Error occurred while changing pending status by Service Provider",
      error
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getAdminComplaints
exports.getServiceProviderComplaints = async (req, res) => {
  try {
    // const {complaintType} = req.body;
    const userDetails = await User.find({ _id: req.user.id }).populate(
      "serviceProviderDetails"
    );
    console.log("Service Provider Details", userDetails);
    // console.log("User Role", userDetails[0].serviceProviderDetails.serviceProviderRole)
    const userRole = userDetails[0].serviceProviderDetails.serviceProviderRole;

    // fetch all complaint
    const complaints = await Complaint.find({
      complaintType: userRole,
      status: { $in: ["Processing", "Solved"] },
    }).populate("sid");

    // return response
    return res.status(200).json({
      success: true,
      message: "Service Provider complaint fetched",
      complaints,
    });
  } catch (error) {
    console.log("Error occurred while fetching Service Provider complaints");
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).populate("sid").exec();

    return res.status(200).json({
      success: true,
      message: "Fetched All Complaints",
      complaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occured while fetching all complaints",
      error: error.message,
    });
  }
};
