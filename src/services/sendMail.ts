import nodemailer from "nodemailer"
import envConfig from "../envConfig/config"

interface IData{
    to: string,
    subject: string,
    text : string
}

const sendMail = async (data:IData) => {
  const transport = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user: envConfig.email,
        pass : envConfig.password
    }
  })
  const mailOptions = {
    from : "Hello Dokkan <alanslashgrg@gmail.com>",
    to : data.to,
    subject : data.subject,
    text : data.text
  }
  try {
    await transport.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
  }
}

export default sendMail