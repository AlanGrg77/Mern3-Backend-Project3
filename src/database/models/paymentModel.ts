import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../../globals/types";
import Order from "./orderModel";

@Table({
  tableName: "payments",
  modelName: "Payment",
  timestamps: true,
})
class Payment extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type : DataType.ENUM(PaymentMethod.COD,PaymentMethod.Esewa,PaymentMethod.Khalti),
    defaultValue : PaymentMethod.COD
  })
  declare paymentMethod : string
  @Column({
    type: DataType.ENUM(PaymentStatus.Paid,PaymentStatus.Unpaid),
    defaultValue : PaymentStatus.Unpaid
  })
  declare paymentStatus: string
  @Column({
    type : DataType.STRING
  })
  declare pidx : string


  @ForeignKey(()=>Order)
  @Column({
    type : DataType.UUID
  })
  orderId!:string
  @BelongsTo(()=>Order)
  order !: Order
}

export default Payment