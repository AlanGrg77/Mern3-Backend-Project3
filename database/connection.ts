import { Sequelize } from 'sequelize-typescript';
import envConfig from '../src/config/config';

 const sequelize = new Sequelize(envConfig.connectionString as string,{
    dialect: 'postgres', // Replace with your database dialect ('mysql', 'sqlite', etc.)
    logging: console.log, // Optional: Enable logging for debugging
    models : [__dirname + '/models']
  })

 try {
    sequelize.authenticate()
    .then(()=>{
        console.log('Authenticated')
    })
    .catch(err=>{
        console.log('error: ',err)
    })
 } catch (error) {
    console.log(error)
 }

sequelize.sync({force: false}).then(()=>{
    console.log('synced')
})

 export default sequelize