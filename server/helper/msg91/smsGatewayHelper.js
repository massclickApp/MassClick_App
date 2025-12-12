import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// const MSG91_AUTHKEY = process.env.MSG91_AUTHKEY;
// const MSG91_FLOW_ID = process.env.MSG91_WHATSAPP_FLOW_ID; 
// const MSG91_SENDER = process.env.MSG91_WHATSAPP_SENDER; 

// Send OTP
export const sendOtp = async (number) => {
  try {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    const baseUrl = process.env.MSG91_BASE_URL;

    if (!authKey || !templateId || !baseUrl) {
      throw new Error("MSG91 environment variables missing.");
    }

    const cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.length !== 10) {
      throw new Error("Invalid phone number. Must be 10 digits.");
    }

    const response = await axios.post(
      baseUrl,
      {
        mobile: `91${cleanNumber}`,
        template_id: templateId
      },
      {
        headers: {
          authkey: authKey,
          "Content-Type": "application/json",
        },
      }
    );


    if (response.data.type !== "success") {
      throw new Error(response.data.message || "Failed to send OTP.");
    }

    return { success: true, apiResponse: response.data };
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw error;
  }
};

// Verify OTP
export const verifyOtp = async (number, otp) => {
  try {
    const authKey = process.env.MSG91_AUTH_KEY;
    const verifyUrl = process.env.MSG91_VERIFY_URL;

    if (!authKey || !verifyUrl) {
      throw new Error("MSG91 environment variables missing.");
    }

    const cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.length !== 10) {
      throw new Error("Invalid phone number. Must be 10 digits.");
    }

    if (!otp) {
      throw new Error("OTP is required for verification.");
    }

    const response = await axios.post(
      verifyUrl,
      {
        mobile: `91${cleanNumber}`,
        otp: otp
      },
      {
        headers: {
          authkey: authKey,
          "Content-Type": "application/json",
        },
      }
    );


    const { type, message } = response.data;

    if (type === "success" || message === "Mobile no. already verified") {
      return { success: true, apiResponse: response.data };
    }

    throw new Error(message || "OTP verification failed.");
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    throw error;
  }
};

// export const sendWhatsAppMessage = async (mobile, variables = {}) => {
//   try {
//     if (!mobile) throw new Error("Mobile number required");

//     const formattedMobile = mobile.toString().replace(/\D/g, "");
//     const mobileWithCountry = "91" + formattedMobile;

//     const payload = {
//       flow_id: MSG91_FLOW_ID,
//       sender: MSG91_SENDER,
//       mobiles: mobileWithCountry,
//       var: variables
//     };

//     const headers = {
//       authkey: MSG91_AUTHKEY,
//       "Content-Type": "application/json",
//     };

//     const response = await axios.post(
//       "https://api.msg91.com/api/v5/whatsapp/flow/",
//       payload,
//       { headers }
//     );

//     return response.data;

//   } catch (err) {
//     console.error("MSG91 WhatsApp error:", err?.response?.data || err.message);
//     throw new Error(err?.response?.data?.message || "WhatsApp sending failed");
//   }
// };