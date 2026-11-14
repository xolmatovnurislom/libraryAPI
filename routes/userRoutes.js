const express = require("express")
const router = express.Router()
const userController = require("../controllers/userControllers")
const { authMiddleware } = require("../middlewares/authMiddleware")
const { roleMiddleware } = require("../middlewares/roleMiddleware")

router.get(
    "/users",
    userController.getUser
)

router.get(
    "/users/profile",
    authMiddleware, roleMiddleware("user"), userController.profile
)

router.get(
    "/users/settings",
    authMiddleware, roleMiddleware("user"), userController.settings
)

router.post(
    "/users/register",
    userController.registerUser
)

router.post(
    "/users/login",
    userController.loginUser
)

router.post(
    "/users/send-otp",
    userController.sendOTP
)

router.post(
    "/users/verify-otp",
    userController.verifyOTP
)

router.delete(
    "/users/:id",
    // authMiddleware, roleMiddleware("user", "admin"), 
    userController.deleteUser
)

router.put(
    "/users/:id",
    authMiddleware, roleMiddleware("user", "admin"), userController.updateUser
)

module.exports = router