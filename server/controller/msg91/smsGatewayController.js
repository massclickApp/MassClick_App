import { sendOtp, verifyOtp } from "../../helper/msg91/smsGatewayHelper.js";
import jwt from "jsonwebtoken";
import User from "../../model/msg91Model/usersModels.js";
import { getSignedUrlByKey } from "../../s3Uploder.js";
import businessListModel from "../../model/businessList/businessListModel.js";

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

// Verify OTP controller
export const verifyOtpAction = async (req, res) => {
  try {
    const { phoneNumber, otp, userName } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, message: "Missing phone number or OTP." });
    }

    // 1️⃣ Verify OTP
    await verifyOtp(phoneNumber.trim(), otp.trim());

    // 2️⃣ Find existing user or create new one
    let user = await User.findOne({ mobileNumber1: phoneNumber });

    if (!user) {
      user = new User({
        userName: userName || `User_${phoneNumber}`,
        mobileNumber1: phoneNumber,
      });
    } else if (userName && userName !== user.userName) {
      user.userName = userName;
    }

    // 3️⃣ Match Business by phoneNumber (contact or contactList)
    const mobileRegex = new RegExp(`\\b${phoneNumber}\\b`);
    const matchedBusiness = await businessListModel.findOne({
      $or: [
        { contact: phoneNumber },
        { contactList: { $regex: mobileRegex } }
      ]
    }).lean();


    // 4️⃣ Auto-fill business details into user
    if (matchedBusiness) {
      user.businessName = matchedBusiness.businessName || "";
      user.businessLocation = matchedBusiness.location || "";

      user.businessCategory = {
        category: matchedBusiness.category || "",
        keywords: matchedBusiness.keywords || [],
        slug: matchedBusiness.slug || "",
        seoTitle: matchedBusiness.seoTitle || "",
        seoDescription: matchedBusiness.seoDescription || "",
        title: matchedBusiness.title || "",
        description: matchedBusiness.description || ""
      };
      user.businessPeople = true;
    }

    await user.save();

    const token = jwt.sign(
      { userId: user._id, mobile: user.mobileNumber1 },
      process.env.JWT_SECRET,
      { expiresIn: "999y" }
    );

    const userObj = user.toObject();
    if (userObj.profileImageKey) {
      userObj.profileImage = getSignedUrlByKey(userObj.profileImageKey);
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: userObj,
      token
    });

  } catch (error) {
    console.error("verifyOtpAction Error:", error);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed.",
      error: error.message
    });
  }
};
