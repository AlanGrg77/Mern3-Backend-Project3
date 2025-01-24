import {Table,Column,Model,DataType, HasMany} from 'sequelize-typescript'
import Order from './orderModel'

@Table({
    tableName : 'users',
    modelName : 'User',
    timestamps : true
})

class User extends Model{
    @Column({
        primaryKey : true,
        type: DataType.UUID,
        defaultValue : DataType.UUIDV4
    })
    declare id:string
    @Column({
        type: DataType.STRING
    })
    declare username:string
    @Column({
        type: DataType.STRING
    })
    declare email:string
    @Column({
        type: DataType.STRING
    })
    declare password:string
    @Column({
        type: DataType.ENUM('customer','admin'),
        defaultValue: 'customer'
    })
    declare role:string
    @Column({
        type: DataType.STRING
    })
    declare otp:string
    @Column({
        type: DataType.STRING
    })
    declare otpGeneratedTime:string
    @HasMany(()=>Order)
    order!:Order[]
}

export default User