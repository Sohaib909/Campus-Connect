const twilio = require('twilio')


const sendReminder = async(to, msgBody) => {
  const accountSid = process.env.TWILIO_ID;
  const authToken = process.env.TWILIO_AUTHTOKEN;
  const client = twilio(accountSid, authToken)

  try{
    const message = await client.messages.create({
        body: msgBody,
        from: "whatsapp:+14155238886",
        to: `whatsapp:${to}`,
    })
    console.log(`Message sent with SID: ${message.sid}`)
  }catch(err){
    res.status(400).json({
        status:"fail",
        message:err.message
    })
  }

}

module.exports = sendReminder;
