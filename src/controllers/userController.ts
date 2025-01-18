import { Request, Response } from "express";
import bcrypt from "bcrypt"
import User from "../database/models/userModel";
import generateToken from "../services/generateToken";
import generateOtp from "../services/generateOtp";
import sendMail from "../services/sendMail";
import findData from "../services/findData";
import sendResponse from "../services/sendResponse";
import checkOtpExpire from "../services/checkOtpExpire";

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
        //Check if email already exits or not
        const [user] = await User.findAll({
            where : {
                email : email
            }
        })
        if(!user){
            sendResponse(res,400,"Invalid email, please try again")
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
    static handleForgotPassword =  async (req:Request,res:Response)=>{
        const {email} = req.body
        if(!email){
            res.status(400).json({
                message: "Please enter email"
            })
            return
        }
        const [user] = await User.findAll({
            where : {
                email : email
            }
        })
        if(!user){
            res.status(404).json({
                message: "Email is not registred."
            })
            return
        }
        const otp = generateOtp()
        sendMail({
            to: email,
            subject : "Hello Dokaan Password Change Reuest",
            text : `Your otp to reset password is : ${otp}`
        })
        user.otp = otp.toString()
        user.otpGeneratedTime = Date.now().toString()
        await user.save()

        res.status(200).json({
            message: "Password reset OTP sent"
        })
    }
    static verifyOtp = async (req:Request,res:Response) => {
        const {otp,email} = req.body
        if(!otp || !email){
            sendResponse(res,404,"Please enter otp and email")
            return
        }
        const user = await findData(User,"email",email)
        if(!user){
            sendResponse(res,404,"No user with that email found")
        }
        const [data] = await User.findAll({
            where:{
                otp,
                email
            }
        })
        if(!data){
            sendResponse(res,404,"Invalid Otp")
            return
        }
        const otpGeneratedTime = data.otpGeneratedTime
        checkOtpExpire(res,otpGeneratedTime,120000)

    }
    static resetPassword = async (req:Request,res:Response) =>{
        const {newPassword,confirmPassword,email} = req.body
        if(!newPassword || !confirmPassword || !email ){
            sendResponse(res,400,"Please enter password,newpassord and email")
            return

        }
        if(newPassword !== confirmPassword ){
            sendResponse(res,400,"newPassword and confirmPassword must be same")
        }
        const user = await findData(User,"email",email)
        if(!user){
            sendResponse(res,404,"No email with this user")
            return
        }
        user.password = bcrypt.hashSync(newPassword,12)
        await user.save()

        sendResponse(res,200,"Password successfully changed")

    }
}

export default UserController