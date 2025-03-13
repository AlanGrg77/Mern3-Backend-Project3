import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import { OrderStatus } from "../../globals/types";
import User from "./userModel";
import Payment from "./paymentModel";
import OrderDetails from "./orderDetails";

@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
})
class Order extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type : DataType.STRING,
    allowNull : false,
    validate : {
        len : {
            args : [10,10],
            msg : "Phone number must have 10 digits"
        }
    }
  })
  declare phoneNumber : string
  @Column({
    type : DataType.STRING,
    allowNull : false
  })
  declare addressLine: string
  @Column({
    type : DataType.STRING,
    allowNull : false
  })
  declare city: string
  @Column({
    type : DataType.STRING,
    allowNull : false
  })
  declare state: string
  @Column({
    type : DataType.INTEGER,
    allowNull : false
  })
  declare zipCode: number
  @Column({
    type : DataType.FLOAT,
    allowNull : false
  })
  declare totalAmount : number
  @Column({
    type : DataType.ENUM(OrderStatus.Pending,OrderStatus.Cancelled,OrderStatus.Delivered,OrderStatus.Ontheway,OrderStatus.Preparation),
    defaultValue : OrderStatus.Pending
  })
  declare orderStatus:string
  @Column({
    type : DataType.STRING, 
    allowNull : false, 
    
})
declare firstName : string 
@Column({
    type : DataType.STRING, 
    allowNull : false, 
})
declare lastName : string 
@Column({
    type : DataType.STRING, 
    allowNull : false, 
})
declare email : string 
  @ForeignKey(()=> User)
  @Column({
    type: DataType.UUID
  })
  userId!:string
  @BelongsTo(()=>User)
  user!:User
  @HasOne(()=>Payment)
  payment!:Payment
  @HasOne(()=>OrderDetails)
  orderDetails!: OrderDetails
}

export default Order