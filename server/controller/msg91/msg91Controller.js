import { generateOtp, verifyOtp } from "../../helper/msg91/msgHelper.js";
import User from "../../model/msg91Model/usersModels.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

export const requestOtp = async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.status(400).json({ success: false, message: "Mobile number required" });

        const otp = await generateOtp(mobile);
        res.json({ success: true, message: "OTP sent successfully", otp });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const verifyOtpAndLogin = async (req, res) => {
    try {
        const { mobile, otp, userName } = req.body;
        if (!mobile || !otp) return res.status(400).json({ success: false, message: "Mobile and OTP required" });

        await verifyOtp(mobile, otp);

        let user = await User.findOne({ mobileNumber1: mobile });
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        // Update userName if provided
        if (userName && userName !== user.userName) {
            user.userName = userName;
            await user.save();
        }

        const token = jwt.sign({ userId: user._id, mobile: user.mobileNumber1 }, JWT_SECRET, { expiresIn: "7d" });

        res.json({ success: true, message: "Login successful", user, token });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
