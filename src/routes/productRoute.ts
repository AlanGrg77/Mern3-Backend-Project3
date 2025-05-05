import express, { Router } from "express";
import userMiddleware, { Role } from "../middleware/userMiddlerware";
import ProductController from "../controllers/productController";
import multer from "multer";
import { storage } from "../middleware/multerMiddleware";
import errorHandler from "../services/errorHandler";

const productRouter: Router = express.Router();

const upload = multer({ storage: storage });
 
productRouter
  .route("/")
  .get(errorHandler(ProductController.getAllProduct))
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    upload.single("productImageUrl"),
    errorHandler(ProductController.createProduct)
  );
productRouter
  .route("/:id")
  .get(errorHandler(ProductController.getSingleProduct))
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(ProductController.deleteProduct)
  );
  productRouter.route("/:id/reviews")
  .post(errorHandler(ProductController.addReview));
export default productRouter;
