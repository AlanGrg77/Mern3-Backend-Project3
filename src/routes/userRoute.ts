import express, { Router } from "express";
import UserController from "../controllers/userController";
import userMiddleware, { Role } from "../middleware/userMiddlerware";
import errorHandler from "../services/errorHandler";
const userRouter: Router = express.Router();

userRouter.route("/register").post(UserController.register);
userRouter.route("/login").post(UserController.login);
userRouter.route("/forgot-password").post(UserController.handleForgotPassword);
userRouter.route("/verify-otp").post(UserController.verifyOtp);
userRouter.route("/reset-password").post(UserController.resetPassword);
userRouter.route("/users").get(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin), errorHandler(UserController.getUser));
userRouter.route("/users/:id").delete(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin), errorHandler( UserController.deleteUsers))



export default userRouter
