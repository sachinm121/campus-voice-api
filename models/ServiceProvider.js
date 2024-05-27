const mongoose = require("mongoose");

const serviceProvider = new mongoose.Schema({
    serviceProviderRole: {
        type: String,
        enum: ["Maintenance", "Safety and Security", "Food"]
    },
})

module.exports = mongoose.model("ServiceProvider", serviceProvider);