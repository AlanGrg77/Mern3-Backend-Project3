import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/paymentModel";
import axios from 'axios'
import Cart from "../database/models/cartModel";
import CryptoJS from "crypto-js"
import envConfig from "../envConfig/config";
import crypto from "crypto"
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

interface IProduct{
    productId : string, 
    productQty : string 
}
interface OrderRequest extends Request{
    user? : {
        id : string
    }
}
interface OrderWithPaymentId extends Order {
  paymentId : string | null
}

class OrderController{
    static async createOrder(req:OrderRequest,res:Response):Promise<void>{
        const userId =  req.user?.id
        const {phoneNumber,firstName,lastName, email, city,addressLine,state,zipCode,totalAmount,paymentMethod} = req.body 
        const products:IProduct[] = req.body.products
        console.log(req.body)
        if(!phoneNumber || !city || !addressLine || !state || !zipCode || !totalAmount || products.length == 0 || !firstName || !lastName || !email  ){
            res.status(400).json({
                message : "Please provide phoneNumber,shippingAddress,totalAmount,products"
            })
            return
        }
        // for order 
        const orderData = await Order.create({
          firstName, 
          lastName, 
          email,
          phoneNumber, 
          addressLine,
          city, 
          state, 
          zipCode, 
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
       
      const data = await OrderDetails.bulkCreate(orderDetailData)

      await Cart.destroy(
       {
        where : {
          productId : products.map((product)=>product.productId), 
          userId : userId
          
        }
       }
      )
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
      }
      else if(paymentMethod == PaymentMethod.Esewa){
        const data = `total_amount=${totalAmount},transaction_uuid=${orderData.id},product_code=${envConfig.product_code}`
        const secretKey = envConfig.secret
        // const hash = CryptoJS.HmacSHA256(data, secretKey as string);
        // const signature = CryptoJS.enc.Base64.stringify(hash);
        const hash =  crypto
                          .createHmac("sha256", secretKey as string)
                          .update(data)
                          .digest("base64");
        console.log("Hash words", hash)
        console.log(data)


        const EsewaformData = ({
          amount: totalAmount.toString(),
          failure_url: "http://localhost:5173/",
          product_delivery_charge: "0",
          product_service_charge: "0",
          product_code: "EPAYTEST",
          signature: hash,
          signed_field_names: "total_amount,transaction_uuid,product_code",
          success_url: "http://localhost:3000/api/order/esewa-verify",
          tax_amount: "0",
          total_amount: totalAmount.toString(),
          transaction_uuid: orderData.id.toString()
        });
        
       res.status(200).json({
        EsewaformData 
       })
       
      }else{
        res.status(200).json({
          message : "Order created successfully",
          data
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
    static verifyEsewaTranscation = async (req:Request, res: Response):Promise<void> =>{
      const { data } = req.query
      if (!data) {
        res.status(400).json({ message: "Invalid request, missing data or signature" });
      }
      const decodedData = JSON.parse(Buffer.from(data as string, 'base64').toString('utf-8'))
      console.log(decodedData)
      // let DecodedData = atob(data as string);
      // DecodedData = await JSON.parse(DecodedData);
      // console.log(DecodedData)
      const { transaction_code, status, transaction_uuid, total_amount, signed_field_names } = decodedData;

      if (!total_amount || !transaction_code || !status || !transaction_uuid || !signed_field_names) {
        res.status(400).json({ message: "Missing required transaction details" });
        return;
      }
      let formattedTotalAmount
      if(total_amount){
        formattedTotalAmount = total_amount.toString().replace(/,/g, "");
      }else{
        console.log("decodeData not found")
      }
    
      try {
        
        //Esewa gives you totoal_amount in "," , please remove it otherwise different signaute will be generated
        const dataE = `transaction_code=${transaction_code},status=${status},total_amount=${formattedTotalAmount},transaction_uuid=${decodedData.transaction_uuid},product_code=${envConfig.product_code},signed_field_names=${signed_field_names}`;
        console.log(dataE)
        const secretKey = envConfig.secret; 
        console.log(secretKey)
        // const hash = CryptoJS.HmacSHA256(dataE, secretKey as string);  
        // const calculatedSignature = CryptoJS.enc.Base64.stringify(hash);
        const CalculatedSignature = crypto
                      .createHmac("sha256", secretKey as string)
                      .update(dataE)
                      .digest("base64");
        console.log(CalculatedSignature)
        console.log(decodedData.signature)
        // Make the request to eSewa to verify the transaction
        if (CalculatedSignature === decodedData.signature && decodedData.status === "COMPLETE") {
            await Payment.update({paymentStatus : PaymentStatus.Paid},{
              where : {
                orderId : decodedData.transaction_uuid
              }
            })
            res.redirect("http://localhost:5173")
          } else {
            res.status(400).json({ message: "Payment Verification Failed, Invalid Signature"});
          }
      } catch (error) {
        res.status(500).json({ error: "An error occurred during payment verification", details: error });
      }
    }
    static async fetchMyOrders(req:OrderRequest,res:Response):Promise<void>{
      const userId = req.user?.id 
      const orders = await Order.findAll({
        where : {
          userId
        }, 
        attributes : ["totalAmount","id","orderStatus"], 
        include : {
          model : Payment, 
          attributes : ["paymentMethod", "paymentStatus"]
        }
      })
      if(orders.length > 0){
        res.status(200).json({
          message : "Order fetched successfully", 
          data : orders 
        })
      }else{
        res.status(404).json({
          message : "No order found", 
          data : []
        })
      }
    }
    static fetchAllOrders = async (req:OrderRequest,res:Response):Promise<void> =>{
      
      const orders = await Order.findAll({
       
        attributes : ["totalAmount","id","orderStatus"], 
        include : {
          model : Payment, 
          attributes : ["paymentMethod", "paymentStatus"]
        }
      })
      if(orders.length > 0){
        res.status(200).json({
          message : "Order fetched successfully", 
          data : orders 
        })
      }else{
        res.status(404).json({
          message : "No order found", 
          data : []
        })
      }
    }
    static fetchMyOrderDetail = async (req:OrderRequest,res:Response):Promise<void> =>{
      const orderId = req.params.id 
      const userId = req.user?.id 
      const orders = await OrderDetails.findAll({
        where : {
          orderId, 

        }, 
        include : [{
          model : Order , 
          include : [
            {
              model : Payment, 
              attributes : ["paymentMethod","paymentStatus"]
            }
          ],
          attributes : ["orderStatus","addressLine","city","state","totalAmount","phoneNumber", "firstName", "lastName","userId"]
        },{
          model : Product, 
          include : [{
            model : Category
          }], 
          attributes : ["productImageUrl","productName","productPrice"]
        }]
      })
      if(orders.length > 0){
        res.status(200).json({
          message : "Order fetched successfully", 
          data : orders 
        })
      }else{
        res.status(404).json({
          message : "No order found", 
          data : []
        })
      }
    }
    static cancelMyOrder = async (req:OrderRequest,res:Response):Promise<void> => {
      const userId = req.user?.id 
      const orderId = req.params.id
      console.log(userId,orderId) 
      const [order] = await Order.findAll({
        where : {
          userId : userId, 
          id : orderId 
        }
      })
      if(!order){
        res.status(400).json({
          message : "No order with that Id"
        })
        return 
      }
      // check order status 
      if(order.orderStatus === OrderStatus.Ontheway || order.orderStatus === OrderStatus.Preparation){
        res.status(403).json({
          message : "You cannot cancelled order, it is on the way or preparation mode"
        })
        return
      }
      await Order.update({orderStatus : OrderStatus.Cancelled},{
        where : {
          id : orderId
        }
      })
      res.status(200).json({
        message : "Order cancelled successfully"
      })
    }
    static changeOrderStatus =  async (req:OrderRequest,res:Response) : Promise<void> =>{
      const orderId = req.params.id 
      const {orderStatus} = req.body
      if(!orderId || !orderStatus){
        res.status(400).json({
          message : "Please provide orderId and orderStatus"
        })
      }
      await Order.update({orderStatus : orderStatus},{
        where : {
          id : orderId
        }
      })
      res.status(200).json({
        message : "Order status updated successfully"
      })
    }
    static async deleteOrder(req:OrderRequest, res:Response) : Promise<void>{

      const orderId = req.params.id 
      const order : OrderWithPaymentId= await Order.findByPk(orderId) as OrderWithPaymentId
      const paymentId = order?.paymentId
      if(!order){
        res.status(404).json({
          message : "You dont have that orderId order"
        })
        return
      }
      await OrderDetails.destroy({
        where : {
          orderId : orderId
        }
      })
      await Payment.destroy({
        where : {
          id : paymentId
        }
      })
      await Order.destroy({
        where : {
          id : orderId
        }
      })
      res.status(200).json({
        message : "Order delete successfully"
      })
    }
}
export default OrderController
