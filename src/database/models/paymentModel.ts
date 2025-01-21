import { Table, Column, Model, DataType } from "sequelize-typescript";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../../globals/types";

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
    type : DataType.ENUM(PaymentMethod.COD,PaymentMethod.Eswa,PaymentMethod.Khalti),
    defaultValue : PaymentMethod.COD
  })
  declare paymentMethod : string
  @Column({
    type: DataType.ENUM(PaymentStatus.Paid,PaymentStatus.Unpaid),
    defaultValue : PaymentStatus.Unpaid
  })
  declare paymentStatus: string
}

export default Payment