import { Table, Column, Model, DataType, HasMany, HasOne, BelongsTo, ForeignKey } from "sequelize-typescript";
import Order from "./orderModel";
import Product from "./productModel";

@Table({
  tableName: "orderDetails",
  modelName: "OrderDetails",
  timestamps: true,
})
class OrderDetails extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type : DataType.INTEGER,
    allowNull : false
  })
  declare quantity:number
  @ForeignKey(()=>Order)
  @Column({
    type: DataType.UUID
  })
  orderId!: string
  @BelongsTo(()=>Order)
  order!:Order
  @ForeignKey(()=>Product)
  @Column({
    type: DataType.UUID
  })
  productId!: string
  @BelongsTo(()=>Product)
  product !: Product
}

export default OrderDetails