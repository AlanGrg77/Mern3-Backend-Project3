 import jwt from 'jsonwebtoken'
import envConfig from '../envConfig/config'

 const generateToken = (userId:string) => {
   const token = jwt.sign({userId : userId},envConfig.jwtSecretKey as string,{
    expiresIn : envConfig.jwtExpiresIn
   })
   return token
 }
 
 export default generateToken