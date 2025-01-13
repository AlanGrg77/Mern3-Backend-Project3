import express from 'express'
import UserController from '../controllers/userController'
const userRoute = express.Router()

userRoute.route("/register").post(UserController.register)
userRoute.route("/login").post(UserController.login)

export default userRoute