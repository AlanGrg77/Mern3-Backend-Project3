import adminSeeder from "./src/adminSeeder";
import { app } from "./src/app";
import envConfig from "./src/envConfig/config";
import CategoryController from "./src/controllers/categoryController";


const startServer = () =>{
    const port = envConfig.port || 4000
    app.listen(port,()=>{
        CategoryController.categorySeeder()
        console.log(`Server has started at port ${port}`)
        adminSeeder()
    })
}

startServer()