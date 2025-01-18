import { Request, Response } from "express";
import Category from "../database/models/categoryModel";
import sendResponse from "../services/sendResponse";

class CategoryController {
  static categoryData = [
    {
      categoryName: "Electronics"
    },
    {
      categoryName: "Groceries"
    },
    {
      categoryName: "Foods"
    },
  ];
  static categorySeeder = async (): Promise<void> => {
    const datas = await Category.findAll();
    if (datas.length === 0) {
      await Category.bulkCreate(this.categoryData);
      console.log("Category seeded successfully");
    } else {
      console.log("Category already seeded");
    }
  };
  static addCategory = async (req:Request,res:Response):Promise<void> =>{
    const {categoryName} =req.body
    if(!categoryName){
        res.status(400).json({
            message : "Please enter Category Name"
        })
        return
    }
    await Category.create({
        categoryName
    })
    res.status(200).json({
        message : "Catgory created successfully"
    })
  }
  static getCategory = async(req:Request,res:Response) =>{
    const datas = await Category.findAll()
    res.status(200).json({
        message : "Fetched Categories ",
        datas
    })

  }
  static deleteCategory = async(req:Request,res:Response) =>{
    const {id} = req.params
    if(!id){
        sendResponse(res,400,"Id not found")
        return
    }
    // const [data] = Category.findAll({
    //     where : {
    //         id
    //     }
    // }) // returns array
    const data = Category.findByPk(id)
    if(!data){
        sendResponse(res,404,"No category with that id")
    }
    else{
        await Category.destroy({
            where  :{
                id
            } 
        })
        sendResponse(res,200,"Category deleted successfully")
    }  
  }
  static updateCategory = async (req:Request,res:Response):Promise<void> =>{
    const {id} = req.params
    const {categoryName} = req.body
    if(!id || !categoryName){
        sendResponse(res,400,"Id not found")
        return
    }
    // const [data] = Category.findAll({
    //     where : {
    //         id
    //     }
    // }) // returns array
    const data = Category.findByPk(id)
    if(!data){
        sendResponse(res,404,"No category with that id")
    }
    else{
        await Category.update({
            categoryName
        },{
            where: {
                id
            }
        })
        sendResponse(res,200,"Category updated successfully")
        
    }  
  }

}

export default CategoryController;
