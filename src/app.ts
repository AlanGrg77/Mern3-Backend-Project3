import express from "express"
import "../database/connection"
import userRoute from "../database/routes/userRoute";


const app = express();
app.use(express.json())

app.use('/api/auth',userRoute)

export {app}