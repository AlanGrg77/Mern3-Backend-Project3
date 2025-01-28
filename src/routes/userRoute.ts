import express, { Router } from "express";
import UserController from "../controllers/userController";
const userRouter: Router = express.Router();

userRouter.route("/register").post(UserController.register);
userRouter.route("/login").post(UserController.login);
userRouter.route("/forgot-password").post(UserController.handleForgotPassword);
userRouter.route("/verify-otp").post(UserController.verifyOtp);
userRouter.route("/reset-password").post(UserController.resetPassword);
userRouter.route("/getUsers").get(UserController.getUser);

export default userRouter
