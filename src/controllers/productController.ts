import { Request, Response } from "express";
import sendResponse from "../services/sendResponse";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";
import Review from "../database/models/review.Model";

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
    const product = await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount: discount || 0,
      categoryId,
      productImageUrl : filename
    });
    res.status(200).json({
      message : "Product created successfully",
      data : product
    })
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
    const [data] = await Product.findAll({
        where: {
            id
        },
        include: [{
            model : Category,
            attributes : ["id","categoryName"]
        },
        {
          model: Review,
          attributes: ["id", "userId", "comment", "rating", "createdAt"],
        }]
        
    })
    res.status(200).json({
      message : "Product fetched successfully",
      data
    })
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
  static addReview = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { userId, comment, rating,username } = req.body;
  
    if (!userId || !comment || !rating) {
      sendResponse(res, 400, "Please provide userId, comment, and rating");
      return;
    }
  
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        sendResponse(res, 404, "Product not found");
        return;
      }
  
      const review = await Review.create({
        productId : id,
        userId,
        username,
        comment,
        rating,
      });
      const updatedProduct = await Product.findOne({
        where: { id },
        include: [
          {
            model: Category,
            attributes: ["id", "categoryName"]
          },
          {
            model: Review,
            attributes: ["id", "userId", "comment", "rating", "createdAt"]
          }
        ]
      });
      
      res.status(200).json({
        message: "Review added and product updated successfully",
        data: updatedProduct
      });
    } catch (error) {
      console.error("Add Review Error:", error);
      sendResponse(res, 500, "Something went wrong", error);
    }
  };
  
}

export default ProductController
