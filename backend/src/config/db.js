const mongoose = require("mongoose");
// const URL = "mongodb://127.0.0.1:27017/gaurav";
const URL = process.env.DB_URL;
const connectDb = async () => {
    try {
        await mongoose.connect(URL);
        console.log(URL);
        
        console.log("connection successfull to DB");
    } catch (error) {
        // console.error("database conection faild" + error);
        console.error(`database connection failed ${error}`);
        process.exit(0);
    }
}
module.exports = connectDb;