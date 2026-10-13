import twilio from 'twilio';

let twilioClient = null;
const getTwilioClient = () => {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

/**
 * Format phone number to international format (+CC followed by number)
 * Handles Indian phone numbers and other formats
 */
const formatPhoneNumber = (mobile) => {
  let phone = mobile.trim();
  
  // Remove leading zeros
  phone = phone.replace(/^0+/, '');
  
  // If doesn't start with +, add country code
  if (!phone.startsWith('+')) {
    // If it's just 10 digits (Indian mobile), add +91
    if (phone.length === 10) {
      phone = '+91' + phone;
    } else if (!phone.startsWith('91')) {
      phone = '+91' + phone;
    } else if (phone.startsWith('91') && phone.length === 12) {
      phone = '+' + phone;
    }
  }
  
  return phone;
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendSms = async (mobile, code) => {
  const message = `Your Malhar Food verification code is: ${code}. This code is valid for 5 minutes.`;
  const client = getTwilioClient();
  
  // Format the phone number properly
  const formattedMobile = formatPhoneNumber(mobile);

  if (client && process.env.TWILIO_PHONE_NUMBER) {
    try {
      console.log(`[Twilio SMS] Attempting to send OTP to ${formattedMobile} (original: ${mobile})`);
      
      const response = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedMobile
      });
      
      console.log(`[Twilio SMS] ✓ Successfully sent OTP to ${formattedMobile}`);
      console.log(`[Twilio SMS] Message SID: ${response.sid}`);
      console.log(`[Twilio SMS] Status: ${response.status}`);
      
      return {
        success: true,
        messageSid: response.sid,
        status: response.status,
        phone: formattedMobile
      };
    } catch (error) {
      console.error(`[Twilio SMS Error] Failed to send SMS to ${formattedMobile}:`, error.message);
      console.error(`[Twilio SMS Error] Error Code: ${error.code}`);
      console.error(`[Twilio SMS Error] Full Error:`, error);
      
      // Log specific error codes
      if (error.code === 21211) {
        console.error(`[Twilio SMS Error] Invalid phone number format: ${formattedMobile}`);
      } else if (error.code === 21606) {
        console.error(`[Twilio SMS Error] Phone number could not be reached`);
      }
      
      throw new Error(`SMS delivery failed: ${error.message}`);
    }
  } else {
    const missingConfig = [];
    if (!client) missingConfig.push('TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN');
    if (!process.env.TWILIO_PHONE_NUMBER) missingConfig.push('TWILIO_PHONE_NUMBER');
    
    console.log(`[Mock SMS] Environment missing: ${missingConfig.join(', ')}`);
    console.log(`[Mock SMS] Skipping actual SMS send. Message would be:`);
    console.log(`[Mock SMS] FROM: ${process.env.TWILIO_PHONE_NUMBER || 'NOT_CONFIGURED'}`);
    console.log(`[Mock SMS] TO: ${formattedMobile}`);
    console.log(`[Mock SMS] MESSAGE: ${message}`);
    
    return {
      success: true,
      mock: true,
      message: 'SMS mocked (Twilio not configured)',
      phone: formattedMobile
    };
  }
};
