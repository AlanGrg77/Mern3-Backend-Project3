import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import OrderDetails from "./orderDetails";
import Cart from "./cartModel";
import Category from "./categoryModel";

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
  @HasMany(()=>Cart)
    cart!:Cart[]
  @ForeignKey(()=>Category)
  @Column({
        type : DataType.UUID
  })
  categoryId !: string
  @BelongsTo(()=>Category)
  category !: Category
}

export default Product;
