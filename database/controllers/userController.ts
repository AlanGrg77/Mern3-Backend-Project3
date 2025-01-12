import { Request, Response } from "express";
import User from "../models/userModel";

class UserController{
    static register = async (req:Request,res:Response) =>{
        const {username,email,password} = req.body
        console.log(req.body)
        if(!username || !email || !password){
            res.status(400).json({
                message: "Enter username,email and password"
            })
            return
        }
        await User.create({
            username,
            email,
            password
        }) 
        res.status(200).json({
            message: "User registered successfully"
        })

    }
}

export default UserController