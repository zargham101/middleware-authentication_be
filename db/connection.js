const mongoose = require('mongoose');
const env = require('dotenv');

env.config();

const uri = process.env.MONGO_URL

const connectDb = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connection established");
    } catch (error) {
        console.log("Database connection error", error.message);
        process.exit(1);
    }
}

module.exports = { connectDb };