const mongoose = require("mongoose")
require("dotenv").config()

async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("baza muvaffaqiyatli ulandi")
    } catch (error) {
        console.log("baza ulanmadi: " + error.message)
        process.exit(1)
    }
}

module.exports = connectDB