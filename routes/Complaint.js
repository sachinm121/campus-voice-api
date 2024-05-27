const express = require("express");
const router = express.Router();

const { createComplaint, updateComplaint, deleteComplaint, getStudentComplaint, changeComplaintStatusByAdmin, getAdminComplaints, changeComplaintStatusByServiceProvider, getServiceProviderComplaints, getAllComplaints } = require("../controllers/Complaint");
const { auth, isStudent, isAdmin, isServiceProvider } = require("../middleware/auth")

router.post("/create",auth, isStudent, createComplaint);
router.post("/update",auth, isStudent, updateComplaint);
router.post("/delete",auth, isStudent, deleteComplaint);
router.get("/studentComplaints",auth, isStudent, getStudentComplaint);

router.post("/changeStatusByAdmin",auth, isAdmin, changeComplaintStatusByAdmin);
router.get("/adminComplaints",auth, isAdmin, getAdminComplaints);

router.post("/changeStatusByServiceProvider",auth, isServiceProvider, changeComplaintStatusByServiceProvider);
router.get("/serviceProviderComplaints",auth, isServiceProvider, getServiceProviderComplaints);


router.get("/getAllComplaints", getAllComplaints);

module.exports = router;