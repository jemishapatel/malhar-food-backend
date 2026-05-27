const twilio = require('twilio');

// Initialize Twilio client. If credentials are not provided in .env, it will fail gracefully and just log.
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/**
 * Generate a random 6-digit OTP code
 */
exports.generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends an SMS containing the OTP code
 * @param {string} mobile The destination mobile number
 * @param {string} code The OTP code to send
 */
exports.sendSms = async (mobile, code) => {
  const message = `Your Malhar Food verification code is: ${code}. This code is valid for 5 minutes.`;

  if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
    try {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobile
      });
      console.log(`[Twilio SMS] Successfully sent OTP to ${mobile}`);
      return true;
    } catch (error) {
      console.error(`[Twilio SMS Error] Failed to send SMS to ${mobile}:`, error.message);
      // Fallback for development if Twilio fails
      return false;
    }
  } else {
    // Development fallback if Twilio is not configured
    console.log(`[Mock SMS] Environment missing Twilio Config. Pretending to send to ${mobile}:`);
    console.log(`MESSAGE: ${message}`);
    return true;
  }
};
