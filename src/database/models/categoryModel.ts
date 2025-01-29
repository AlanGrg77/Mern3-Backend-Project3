import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript"
import Product from "./productModel"

@Table({
    tableName : "categories",
    modelName : "Categorie",
    timestamps : true
})
class Category extends Model{
    @Column({
        primaryKey : true,
        type : DataType.UUID,
        defaultValue : DataType.UUIDV4
    })
    declare id : string 
    @Column({
        type : DataType.STRING,
        allowNull : false
    })
    declare categoryName : string
    @HasMany(()=>Product)
    product !: Product[]
}

export default Category