import { Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

// interface IProductRequest extends Request{
//     file ?: {
//         filename : string
//     }
// }

class ProductController {
  static createProduct = async (req:Request, res: Response): Promise<void> => {
    const {
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount,
      categoryId,
    } = req.body;

    const filename = req.file
      ? req.file.filename
      : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcoffective.com%2Fdefault-featured-image-png%2F&psig=AOvVaw0q7VYNaNrVZ4pYwcFOGpLu&ust=1737388445669000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMCv-LqSgosDFQAAAAAdAAAAABAE";
    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productTotalStock ||
      !categoryId
    ) {
      sendResponse(
        res,
        400,
        "Please enter productName,productDescription,productPrice,productTotalStock,discount,categoryId "
      );
      return;
    }
    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount: discount || 0,
      categoryId,
      productImageUrl : filename
    });
    sendResponse(res,200,"Product created")
  };
  static getAllProduct = async(req:Request,res:Response):Promise<void> =>{
    const datas = await Product.findAll({
        include : {
            model : Category,
            attributes : ["id","categoryName"]
        }
    })
    sendResponse(res,200,"Products fetched successfully",datas)
  }
  static getSingleProduct = async (req:Request,res:Response):Promise<void> =>{
    const {id} = req.params
    const data = await Product.findAll({
        where: {
            id
        },
        include: {
            model : Category,
            attributes : ["id","categoryName"]

        }
    })
    sendResponse(res,200,"Product fetched successfully",data)
  }
  static deleteProduct = async (req:Request,res:Response):Promise<void> =>{
    const {id} = req.params
    const data = await Product.findAll({
        where : {
            id,
        }
    })
    if(data.length === 0 ){
        sendResponse(res,404,"No product found with this id")
    }else{
        await Product.destroy({
            where : {
                id
            }
        })
    }
    sendResponse(res,200,"Product successfully deleted",data)

  }
  
}

export default ProductController
