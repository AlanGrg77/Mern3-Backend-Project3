import express from 'express'
import UserController from '../controllers/userController'
const userRoute = express.Router()

userRoute.route("/register").post(UserController.register)

export default userRoute