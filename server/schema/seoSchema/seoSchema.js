import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
  {
    pageType: {
      type: String, 
      required: true,
    },

    category: {
      type: String, 
    },

    location: {
      type: String, 
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    keywords: {
      type: String,
    },

    canonical: {
      type: String,
    },

    robots: {
      type: String,
      default: "index, follow",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default seoSchema;
