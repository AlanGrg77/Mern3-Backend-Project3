import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from "sequelize-typescript";
import OrderDetails from "./orderDetails";

@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true,
})
class Product extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productName: string;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare productDescription: string;
  @Column({
    type: DataType.FLOAT,
  })
  declare productPrice: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare productTotalStock: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare discount: number;

  @Column({
    type: DataType.STRING,
  })
  declare productImageUrl: string;
  @HasMany(()=>OrderDetails)
  orderDetails !: OrderDetails[]
}

export default Product;
