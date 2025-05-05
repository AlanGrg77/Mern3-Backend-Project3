import  jwt from 'jsonwebtoken';
import adminSeeder from "./src/adminSeeder";
import { app } from "./src/app";
import envConfig from "./src/envConfig/config";
import CategoryController from "./src/controllers/categoryController";
import {Server} from "socket.io"
import User from './src/database/models/userModel';
import Order from './src/database/models/orderModel';

const startServer = () =>{
    const port = envConfig.port || 4000
    const server = app.listen(port,()=>{
        CategoryController.categorySeeder()
        console.log(`Server has started at port ${port}`)
        adminSeeder()
    })
    const io = new Server(server,{cors :{
        origin : "http://localhost:5173"
    }})

    let onLineUsers:{socketId:string,userId:string,role:string}[]= [];
    let addToOnLineUsers = (socketId:string,userId:string,role:string) =>{
        onLineUsers = onLineUsers.filter((user)=>user.userId !== userId)
        onLineUsers.push({socketId,userId,role})
    }
    const removeFromOnlineUsers = (socketId: string) => {
        onLineUsers = onLineUsers.filter(user => user.socketId !== socketId);
    };


    io.on("connection",(socket)=>{
        console.log("connected")
        const {token} = socket.handshake.auth
        console.log(token)
        if(token){
            jwt.verify(token as string, envConfig.jwtSecretKey as string,async (err,result:any)=>{
                if(err){
                    socket.emit("error",err)
                }else{
                    const userData = await User.findByPk(result.userId)
                    if(!userData){
                        socket.emit("error","No user with that token")
                        return
                    }
                console.log(socket.id,result.userId,userData.role)
                addToOnLineUsers(socket.id,result.userId,userData.role)
                console.log(onLineUsers)
                }
            })
        }else{
            console.log("triggered") 
            socket.emit("error","Please provide token")
        }
        
        console.log(onLineUsers)
        socket.on("updateOrderStatus",async (data)=>{
            const {status,orderId,userId} = data
            console.log(status,orderId)
            const findUser = onLineUsers.find(user=>user.userId == userId) 
            await Order.update(
                {
                    orderStatus : status
                },
               {
                 where : {
                    id : orderId
                }
               } 
            )
            if(findUser){
                io.to(findUser.socketId).emit("statusUpdated",data)
            }else{
                socket.emit("error","User is not online!!")
            }
        }
       
        )
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
            removeFromOnlineUsers(socket.id);
            console.log("Updated Online Users:", onLineUsers);
        });
    })
}

startServer()