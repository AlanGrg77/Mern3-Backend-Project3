import express from "express"
import "./database/connection"
import userRouter from "./routes/userRoute";
import categoryRouter from "./routes/categoryRoute";


const app = express();
app.use(express.json())

app.use('/api/auth',userRouter)
app.use('/api/category',categoryRouter)

export {app}