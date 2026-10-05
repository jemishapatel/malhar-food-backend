import twilio from 'twilio';

let twilioClient = null;
const getTwilioClient = () => {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendSms = async (mobile, code) => {
  const message = `Your Malhar Food verification code is: ${code}. This code is valid for 5 minutes.`;
  const client = getTwilioClient();

  if (client && process.env.TWILIO_PHONE_NUMBER) {
    try {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobile
      });
      console.log(`[Twilio SMS] Successfully sent OTP to ${mobile}`);
      return true;
    } catch (error) {
      console.error(`[Twilio SMS Error] Failed to send SMS to ${mobile}:`, error.message);
      return false;
    }
  } else {
    console.log(`[Mock SMS] Environment missing Twilio Config. (SID=${Boolean(process.env.TWILIO_ACCOUNT_SID)}, TOKEN=${Boolean(process.env.TWILIO_AUTH_TOKEN)}, PHONE=${Boolean(process.env.TWILIO_PHONE_NUMBER)}). Pretending to send to ${mobile}:`);
    console.log(`MESSAGE: ${message}`);
    return true;
  }
};
