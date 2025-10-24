import { sendOtp, verifyOtp } from "../../helper/msg91/smsGatewayHelper.js";
import jwt from "jsonwebtoken";
import User from "../../model/msg91Model/usersModels.js";
import { uploadImageToS3, getSignedUrlByKey } from "../../s3Uploder.js";


export const sendOtpAction = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "Missing phone number." });
  }

  try {
    const result = await sendOtp(phoneNumber.trim());

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      data: result.apiResponse,
    });
  } catch (error) {
    console.error("Controller Error (sendOtpAction):", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP.",
      error: error.message,
    });
  }
};
export const verifyOtpAction = async (req, res) => {
  const { phoneNumber, otp, userName } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: "Missing phone number or OTP." });
  }

  try {
    const result = await verifyOtp(phoneNumber.trim(), otp.trim());

    let user = await User.findOne({ mobileNumber1: phoneNumber });

    if (!user) {
      user = new User({
        userName: userName || `User_${phoneNumber}`, 
        mobileNumber1: phoneNumber,
      });
      await user.save();
    } else if (userName && userName !== user.userName) {
      user.userName = userName;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, mobile: user.mobileNumber1 },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userObj = user.toObject();
    if (userObj.profileImageKey) {
      userObj.profileImage = getSignedUrlByKey(userObj.profileImageKey);
    }

    return res.status(200).json({
      success: true,
      message: result.apiResponse.message || "OTP verified successfully",
      user: userObj,
      token,
    });
  } catch (error) {
    console.error("Controller Error (verifyOtpAction):", error.message);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed.",
      error: error.message,
    });
  }
};