import express, { Router } from "express";
import CategoryController from "../controllers/categoryController";
import userMiddleware, { Role } from "../middleware/userMiddlerware";

const categoryRouter: Router = express.Router();

categoryRouter.route('/')
.get(CategoryController.getCategory)
.post(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin), CategoryController.addCategory)
categoryRouter.route('/:id')
.patch(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin),CategoryController.updateCategory)
.delete(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin),CategoryController.deleteCategory)



export default categoryRouter;
