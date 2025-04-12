import express, { Router } from "express";
import orderController from "../controllers/orderController";
import userMiddleware from "../middleware/userMiddlerware";
import errorHandler from "../services/errorHandler";

const orderRouter: Router = express.Router();
orderRouter
  .route("/")
  .get(userMiddleware.isUserLoggedIn,errorHandler(orderController.fetchAllOrders))
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.createOrder)
  );
orderRouter.route("/:id").get(userMiddleware.isUserLoggedIn,errorHandler(orderController.fetchMyOrderDetail))
orderRouter
  .route("/verify-pidx")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.verifyKTransaction)
  );
orderRouter
  .route("/esewa-verify")
  .get(orderController.verifyEsewaTranscation)
export default orderRouter;
