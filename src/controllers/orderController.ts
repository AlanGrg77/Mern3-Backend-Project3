import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/paymentModel";
import axios from 'axios'

interface IProduct{
    productId : string, 
    productQty : string 
}
interface OrderRequest extends Request{
    user? : {
        id : string
    }
}
class OrderController{
    static async createOrder(req:OrderRequest,res:Response):Promise<void>{
        const userId =  req.user?.id
        const {phoneNumber,shippingAddress,totalAmount,paymentMethod} = req.body 
        const products:IProduct[] = req.body.products
        if(!phoneNumber || !shippingAddress || !totalAmount || products.length == 0 ){
            res.status(400).json({
                message : "Please provide phoneNumber,shippingAddress,totalAmount,products"
            })
            return
        }
        // for order 
        const orderData = await Order.create({
            phoneNumber, 
            shippingAddress, 
            totalAmount, 
            userId
        })
        // for orderDetails
        console.log(orderData,"OrderData!!")
        console.log(products)
      const orderDetailData = products.map((product)=>({
             quantity : product.productQty, 
             productId : product.productId, 
             orderId : orderData.id
       }))
      await OrderDetails.bulkCreate(orderDetailData)
      // for payment 
      const paymentData = await Payment.create({
        orderId : orderData.id, 
        paymentMethod : paymentMethod,
      })
      if(paymentMethod == PaymentMethod.Khalti){
         const data = {
          return_url : "http://localhost:5173/", 
          website_url : "http://localhost:5173/", 
          amount : totalAmount * 100, 
          purchase_order_id : orderData.id, 
          purchase_order_name : "order_" + orderData.id
        }
        const response = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/',data,{
          headers : {
            Authorization : "Key 791cdc3b433543c9a198d95f19e0639d"
          }
        })
        const KhaltiResponse = response.data
        paymentData.pidx = KhaltiResponse.pidx
        paymentData.save()
        res.status(200).json({
          message : "Order created successfully", 
          url : KhaltiResponse.payment_url,
          pidx : KhaltiResponse.pidx
        })
      }else{
        res.status(200).json({
          message : "Order created successfully"
        })
      }
     
    }
    static verifyKTransaction = async (req:Request,res: Response):Promise<void> =>{
      const {pidx} = req.body
      if(!pidx){
        res.status(400).json({
          message : "Please provide pidx"
        })
        return
      }
      const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{
        pidx : pidx
      },{
        headers :{
          Authorization : "Key 791cdc3b433543c9a198d95f19e0639d"
        }
      })

      const data = response.data
      if(data.status === "Completed"){
        await Payment.update({paymentStatus : PaymentStatus.Paid},{
          where : {
            pidx : pidx
          }
        })
        res.status(200).json({
          message : "Payment verified"
        })
      }else{
        res.status(400).json({
          message : "Payment not verified or cancelled"
        })
      }


    }
}
export default OrderController
