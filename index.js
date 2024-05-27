const express = require("express");
const app = express();

// Import Routes
const userRoutes = require('./routes/User');
const complaintRoutes = require('./routes/Complaint');
const contactusRouter = require("./routes/ContactUs")

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser")
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT;

// Database connectivity
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/"
    })
)

// cloudinary connectivity
cloudinaryConnect();

// Route mount
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/complaint", complaintRoutes);
app.use("/api/v1/contact", contactusRouter)

// default route
app.get("/",(req, res) => {
    return res.json({
        success: true,
        message: "Home Page"
    })
})

app.listen(PORT, (error) => {
    console.log(`Server is running on port ${PORT}`)
})