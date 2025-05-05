import { Response } from "express"
import sendResponse from "./sendResponse"


const checkOtpExpire = (res:Response,otpGeneratedTime:string,thresholdTime:number) => {
  const currentTime = Date.now()
  if(currentTime - parseInt(otpGeneratedTime) <= thresholdTime){
    sendResponse(res,200,'Valid OTP, you can proceed')
  }else{
    sendResponse(res,400,"Otp Expired, send another otp and try again")
  }
}

export default checkOtpExpire 