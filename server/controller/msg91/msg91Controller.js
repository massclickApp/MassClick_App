import { generateOtp, verifyOtp } from "../../helper/msg91/msgHelper.js";
import User from "../../model/msg91Model/usersModels.js";
import jwt from "jsonwebtoken";
// 1. IMPORT S3 UTILITIES
import { uploadImageToS3, getSignedUrlByKey } from "../../s3Uploder.js";

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

        // Fetch user data with image URL for the response (optional but good practice)
        const userObject = user.toObject();
        if (userObject.profileImageKey) {
            userObject.profileImage = getSignedUrlByKey(userObject.profileImageKey);
        }

        res.json({ success: true, message: "Login successful", user: userObject, token });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const updateOtpUser = async (req, res) => {
    try {
        const { mobile } = req.params;
        const updateData = req.body;

        const user = await User.findOne({ mobileNumber1: mobile });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

      
        if (updateData.profileImage?.startsWith("data:image")) {
            const uploadResult = await uploadImageToS3(
                updateData.profileImage,
                `user/profiles/${user._id}/profile-${Date.now()}`
            );
            user.profileImageKey = uploadResult.key; 
        } else if (updateData.profileImage === null || updateData.profileImage === "") {
            user.profileImageKey = "";
        }
        
        delete updateData.profileImage;

        const forbiddenFields = ["currentOtp", "otpGeneratedAt", "otpExpiresAt"];
        // Ensure profileImageKey is not directly updated via the loop
        forbiddenFields.push("profileImageKey"); 
        
        forbiddenFields.forEach(field => delete updateData[field]);

        Object.keys(updateData).forEach(key => {
            user[key] = updateData[key];
        });

        await user.save();
        
        // Prepare response: get signed URL for the saved key
        const userObject = user.toObject();
        if (userObject.profileImageKey) {
            userObject.profileImage = getSignedUrlByKey(userObject.profileImageKey);
        }

        res.json({ success: true, message: "User updated successfully", user: userObject });
    } catch (err) {
        console.error("Error updating user:", err); // Add error logging
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. MODIFIED viewOtpUser to include signed URL
export const viewOtpUser = async (req, res) => {
    try {
        const { mobile } = req.params;
        const user = await User.findOne({ mobileNumber1: mobile }).lean(); // Use .lean() for faster read
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
    
        if (user.profileImageKey) {
            user.profileImage = getSignedUrlByKey(user.profileImageKey);
        }

        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const viewAllOtpUsers = async (req, res) => {
    try {
        const users = await User.find({}).lean(); // Use .lean()
        

        const usersWithImages = users.map(user => {
            if (user.profileImageKey) {
                user.profileImage = getSignedUrlByKey(user.profileImageKey);
            }
            return user;
        });

        res.json({ success: true, count: usersWithImages.length, users: usersWithImages });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteOtpUser = async (req, res) => {
    try {
        const { mobile } = req.params;
        const user = await User.findOneAndDelete({ mobileNumber1: mobile });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

     

        res.json({ success: true, message: "User deleted successfully", user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};