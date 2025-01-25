import {Table,Column,Model, DataType, ForeignKey, BelongsTo} from 'sequelize-typescript'
import User from './userModel'
import Product from './productModel'
@Table({
    tableName : "carts", 
    modelName : "Cart", 
    timestamps : true
})
class Cart extends Model {
@Column({
    primaryKey : true, 
    type : DataType.UUID, 
    defaultValue : DataType.UUIDV4
})
declare id:string
@Column({
    type : DataType.INTEGER, 
    allowNull : false
})
declare quantity : number
@ForeignKey(()=>User)
@Column({
    type : DataType.UUID
})
userId!: string
@BelongsTo(()=>User)
user!:User
@ForeignKey(()=>Product)
@Column({
    type : DataType.UUID
})
productId!: string
@BelongsTo(()=>Product)
product!:Product
}

export default Cart