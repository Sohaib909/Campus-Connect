const nodemailer = require('nodemailer')

const sendEmail = async(option) =>{

    const transporter = nodemailer.createTransport({
        service: 'gmail',
         //host: process.env.EMAIL_HOST,
         //port: process.env.EMAIL_PORT,
        
        auth:{
            //user: process.env.EMAIL_USER,
            //pass: process.env.EMAIL_PASS
            user: 'eziocsg420@gmail.com', 
            pass: 'bwfdlcvgfgiauczm' , 
        }
    })

    const emailOptions ={
        from: 'eziocsg420@gmail.com',
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(emailOptions)

}

module.exports = sendEmail;