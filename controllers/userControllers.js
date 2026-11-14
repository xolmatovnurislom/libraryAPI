const User = require("../models/user")
const {registerSchema, loginSchema} = require("../validators/userValidators")
const bcrypt = require("bcrypt")
const transporter = require("../config/mail")
const generateToken = require("../utils/generateToken")
require("dotenv").config()

exports.getUser = async (req, res) => {
    const user = await User.find().select("-password")
    res.status(200).json(user)
}

exports.registerUser = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: "registratsiyadan o'tmadi!"
            })
        }

        const {ism, yosh, email, password, role} = validation.data

        const existingUser = await User.findOne({email})

        if (existingUser) {
            return res.status(400).json({
                message: "Bunday foydalanuvchi oldin ro'yxatdan o'tgan!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            ism, yosh, email, role, password: hashedPassword
        })

        const token = generateToken(newUser)

        res.status(201).json({
            message: "Foydalanuvchi ro'yxatdan o'tdi!",
            user: newUser,
            token: token
        }
    )

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.loginUser = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                xabar: "validatsiyadan o'tmadi"
            })
        }

        const {email, password} = validation.data

        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({
                xabar: "Bu email bo'yicha foydalanuvchi topilmadi. Ro'yxatdan o'ting!"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                xabar: "Parol noto'g'ri!"
            })
        }

        const token = generateToken(user)

        res.status(200).json({
            xabar: "Login qilindi!",
            token
        })

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).json({message: "Bunday foydalanuvchi topilmadi!"})
        }

        res.status(200).json({message: "Foydalanuvchi o'chirildi!"})

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        )

        if (!user) {
            res.status(404).json({
                message: "Bunday foydalanuvchi topilmadi!"
            })
        }

        res.status(200).json({message: "Foydalanuvchi yangilandi!"})

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.profile = async (req, res) => {
    res.status(200).json({
        message: "profilingizga xush kelibsiz!"
    })
}

exports.settings = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select("-password")

        if (!user) {
            return res.status(404).json({
                message: "Foydalanuvchi topilmadi!"
            })
        }

        res.status(200).json({
            message: `Xush kelibsiz ${user.ism}, sizning yoshingiz ${user.yosh}, emailingiz ${user.email}`
        })
    } catch (error) {
        res.status(500).send(error)
    }
    


}

const otpStore = {}
exports.sendOTP = async (req, res) => {
    try {
        const {email} = req.body

        if (!email) {
            return res.status(400).json({
                message: "Email kiritilishi shart!"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000)

        otpStore[email] = otp
        
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "OTP code",
            text: `Sizning tasdiqlash kodingiz: ${otp}`
        })

        res.status(200).json({
            message: "otp yuborildi!",
            otp: otp
        })

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const {email, otp} = req.body

        if (!email || !otp) {
            return res.status(400).json({
                message: "email va otp kiritilishi shart!"
            })
        }

        if (otpStore[email] == otp) {

            delete otpStore[email]

            return res.status(200).json({
                message: "otp qabul qilindi"
            })
        }

        res.status(400).send("xato otp")
    } catch (error) {
        res.status(500).send(error)
    }
}