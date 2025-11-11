  import mongoose from "mongoose";

  const message91UsersSchema = new mongoose.Schema({
    title: { type: String, enum: ["Mr", "Ms"], default: "Ms" },
    userName: { type: String, },
    businessName: { type: String, default: "" },  
    businessCategory: { type: String, default: "" },  
    firstTimeUser: { type: Boolean, default: false },
    profileImageKey: { type: String, default: "" },
    email: { type: String, },
    emailVerified: { type: Boolean, default: false },
    mobileNumber1: { type: String, unique: true, required: true },
    currentOtp: { type: String, default: null },
    otpGeneratedAt: { type: Date, default: null },
    otpExpiresAt: { type: Date, default: null },
    mobileNumber1Verified: { type: Boolean, default: true },
    mobileNumber2: { type: String, default: "" },
    mobileNumber2Verified: { type: Boolean, default: false },
    permanentAddress: {
      plotNo: { type: String, },
      street: { type: String, },
      pincode: { type: String, },
      homeLandline: { type: String, default: "" },
      officeLandline: { type: String, default: "" },
    },
    officeAddress: {
      plotNo: { type: String, default: "" },
      street: { type: String, default: "" },
      pincode: { type: String, default: "" },
      officeLandline: { type: String, default: "" },
    },

    familyAndFriends: [
      {
        name: { type: String, },
        relation: { type: String, default: "" },
        contactNumber: { type: String, default: "" },
        email: { type: String, default: "" },
      }
    ],

    favorites: {
      colors: [String],
      food: [String],
      hobbies: [String],
    },
  searchHistory: [
    {
      query: { type: String, required: true },
      location: { type: String, default: "Global" },
      category: { type: String, default: "General" },
      searchedAt: { type: Date, default: Date.now },
    },
  ],


    profileCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  export default message91UsersSchema;
