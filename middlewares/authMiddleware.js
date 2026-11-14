const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            message: "Token kiritilishi shart!"
        })
    }

    const token = authHeader.split(" ")

    if (token[0] !== "Bearer") {
        return res.status(401).json({
            message: "Bearer yo'q"
        })
    }

    try {
        const decoded = jwt.verify(token[1], process.env.JWT_SECRET)
        req.user = decoded

        next()
        
    } catch (error) {
        res.status(401).send("Token noto'g'ri yoki muddati tugagan")
    }
} 