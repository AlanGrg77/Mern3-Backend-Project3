import { Request, Response } from "express";
import bcrypt from "bcrypt"
import User from "../database/models/userModel";
import generateToken from "../services/generateToken";

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
            password : bcrypt.hashSync(password,10)
        }) 
        res.status(200).json({
            message: "User registered successfully"
        })

    }
    static login = async (req:Request,res:Response) =>{
        const {email,password} = req.body
        if(!email || !password){
            res.status(400).json(
                {
                    message : "Please enter eail and password"
                }
            )
        }
        const [user] = await User.findAll({
            where : {
                email : email
            }
        })
        if(!user){
            res.status(404).json({
                message: "This email doesn't exit"
            })
        }else{
            const isEqual = bcrypt.compareSync(password,user.password)
            if(!isEqual){
                res.status(400).json({
                    message: "Password is invalid"
                })
            }else{
                const token = generateToken(user.id)
                res.status(200).json({
                    message:"Logged in",
                    token
                })
            }
        }

    }
}

export default UserController