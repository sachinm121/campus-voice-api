const mongoose = require("mongoose");
const colors = require("colors")

require("dotenv").config();
exports.connect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        // useNewUrlParser : true,
        // useUnifiedTopology : true
    })
    .then(() => console.log(colors.green('Database Connected Successfully')))
    .catch((error) => {
        console.log(colors.red.underline('Database Connection Filed'))
        console.error(error);
        process.exit(1);
    })
};
