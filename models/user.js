const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        ism: {
            type: String,
            required: true
        },

        yosh: Number,

        email: {
            type: String,
            required: true,
            unique: true
        },
        
        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            required: true
        },
    }
)

module.exports = mongoose.model("User", userSchema)