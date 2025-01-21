"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminSeeder_1 = __importDefault(require("./src/adminSeeder"));
const app_1 = require("./src/app");
const config_1 = __importDefault(require("./src/config/config"));
const categoryController_1 = __importDefault(require("./src/controllers/categoryController"));
const startServer = () => {
    const port = config_1.default.port || 4000;
    app_1.app.listen(port, () => {
        categoryController_1.default.categorySeeder();
        console.log(`Server has started at port ${port}`);
        (0, adminSeeder_1.default)();
    });
};
startServer();
