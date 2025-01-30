import { NextFunction, Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import jwt from "jsonwebtoken"
import envConfig from "../envConfig/config";
import User from "../database/models/userModel";

export enum Role{
    Admin = "admin",
    Customer = "customer"
}

interface IExtenedRequest extends Request{
 user? : {
    username : string,
    email : string,
    role : string,
    password : string,
    id : string
 }

}

class userMiddleware {
    static isUserLoggedIn = async (req:IExtenedRequest,res:Response,next:NextFunction):Promise<void>=>{
        const token = req.headers.authorization
        console.log(token);
        if(!token){
            sendResponse(res,403,"Token not provided")
            return
        }
        jwt.verify(token,envConfig.jwtSecretKey as string,async (err,result:any)=>{
            if(err){
                console.log(err)
                sendResponse(res,403,"Invalid token")
            }else{
                console.log(result.userId)
                const userData = await User.findByPk(result.userId)
                console.log(userData)
                if(!userData){
                    sendResponse(res,404,"No user with that user Id")
                    return
                }
                req.user = userData
                next()
            }
           
        })

    } 
    static accessTo(...roles:Role[]){
        return((req:IExtenedRequest,res:Response,next:NextFunction)=>{
            let userRole = req.user?.role as Role
            if(!roles.includes(userRole)){
                sendResponse(res,403,"You do not have permission")
                return
            }
            next()
        })
    }
    // static accessTo = (...roles: Role[]) => 
    //     (req: IExtenedRequest, res: Response, next: NextFunction) => 
    //       roles.includes(req.user?.role as Role) 
    //         ? next() 
    //         : sendResponse(res, 403, "You do not have permission");
}

export default userMiddleware