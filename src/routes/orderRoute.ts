import express, { Router } from "express";
import orderController from "../controllers/orderController";
import userMiddleware from "../middleware/userMiddlerware";
import errorHandler from "../services/errorHandler";

const orderRouter: Router = express.Router();
orderRouter
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.createOrder)
  );
orderRouter
  .route("/verify-pidx")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.verifyKTransaction)
  );
export default orderRouter;
