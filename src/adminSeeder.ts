import  bcrypt  from 'bcrypt';
import envConfig from "./envConfig/config"
import User from "./database/models/userModel"


const adminSeeder = async () => {
    const [admin] = await User.findAll({
        where:{
            email : envConfig.adminEmail
        }
    })
    if(!admin){
        await User.create({
            username : envConfig.adminName,
            email : envConfig.adminEmail,
            password : bcrypt.hashSync(envConfig.adminPassword as string,12),
            role : "admin"
        })
        console.log("Admin seeded!!!")
    }else{
        console.log("Admin already seeded!!!")
    }
    
}

export default adminSeeder