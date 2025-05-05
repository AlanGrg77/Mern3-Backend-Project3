import express, { Router } from "express";
import orderController from "../controllers/orderController";
import userMiddleware, { Role } from "../middleware/userMiddlerware";
import errorHandler from "../services/errorHandler";

const orderRouter: Router = express.Router();
orderRouter
  .route("/")
  .get(userMiddleware.isUserLoggedIn,errorHandler(orderController.fetchMyOrders))
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.createOrder)
  );
orderRouter.route("/all").get(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin), errorHandler(orderController.fetchAllOrders))

orderRouter
  .route("/verify-pidx")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.verifyKTransaction)
  );
orderRouter
  .route("/esewa-verify")
  .get(orderController.verifyEsewaTranscation)
orderRouter.route("/admin/change-status/:id").patch(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin) ,errorHandler(orderController.changeOrderStatus))  
orderRouter.route("/admin/delete-order/:id").post(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin) ,errorHandler(orderController.deleteOrder))
orderRouter.route("/cancel-order/:id").patch(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Customer) ,errorHandler(orderController.cancelMyOrder))
orderRouter.route("/:id").get(userMiddleware.isUserLoggedIn,errorHandler(orderController.fetchMyOrderDetail))
export default orderRouter;
