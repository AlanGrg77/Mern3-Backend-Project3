
 
 const findData = async (model:any,query1:string,query2:string) => {
   const [result] = await model.findAll({
    where:{
        [query1] : query2
    }
    
 })
 return result
 }
 
 export default findData