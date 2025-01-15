import express from 'express'
import UserController from '../controllers/userController'
const userRoute = express.Router()

userRoute.route("/register").post(UserController.register)
userRoute.route("/login").post(UserController.login)
userRoute.route("/forgot-password").post(UserController.handleForgotPassword)
userRoute.route("/verify-otp").post(UserController.verifyOtp)
userRoute.route("/reset-password").post(UserController.resetPassword)

export default userRoute