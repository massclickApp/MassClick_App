import message91Model from "../../model/msg91Model/msg91Model.js";
import User from "../../model/msg91Model/usersModels.js";

// Generate OTP and store
export const generateOtp = async (mobile) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();                          // OTP generation time
    const expiresAt = new Date(now.getTime() + 5*60*1000); // 5 min expiry

    const otpDoc = new message91Model({
        mobile,
        otp,
        generatedAt: now,   
        expiresAt
    });
    await otpDoc.save();

    let user = await User.findOne({ mobileNumber1: mobile });
    if (!user) {
        user = new User({
            mobileNumber1: mobile,
            currentOtp: otp,
            otpGeneratedAt: now,   
            otpExpiresAt: expiresAt
        });
    } else {
        user.currentOtp = otp;
        user.otpGeneratedAt = now;  
        user.otpExpiresAt = expiresAt;
    }

    await user.save();

    return otp;
};


// Verify OTP
export const verifyOtp = async (mobile, otp) => {
    const otpDoc = await message91Model.findOne({ mobile, otp, isActive: true });
    if (!otpDoc) throw new Error("Invalid OTP");
    if (otpDoc.expiresAt < new Date()) {
        otpDoc.isActive = false;
        await otpDoc.save();
        throw new Error("OTP expired");
    }
    otpDoc.isActive = false;
    await otpDoc.save();

    const user = await User.findOne({ mobileNumber1: mobile });
    if (!user) throw new Error("User not found");
    if (user.currentOtp !== otp || user.otpExpiresAt < new Date()) {
        throw new Error("OTP invalid or expired for user");
    }

    // Clear OTP after verification
    user.currentOtp = null;
    user.otpExpiresAt = null;
    await user.save();

    return true;
};
