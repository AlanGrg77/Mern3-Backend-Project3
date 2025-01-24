import express from "express"
import "./database/connection"
import userRouter from "./routes/userRoute";
import categoryRouter from "./routes/categoryRoute";
import productRouter from "./routes/productRoute";
import orderRouter from "./routes/orderRoute";


const app = express();
app.use(express.json())

app.use('/api/auth',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/product',productRouter)
app.use("/api/order",orderRouter)

export {app}