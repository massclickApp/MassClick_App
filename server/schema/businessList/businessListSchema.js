import mongoose from "mongoose"

const businessListSchema = new mongoose.Schema({
  clientId: { type: String, default: '', },
  businessName: { type: String, default: '', required: true },
  plotNumber: { type: String, default: '', },
  street: { type: String, default: '', },
  pincode: { type: String, default: '', required: true },
  email: { type: String, default: '', required: true },
  contact: { type: String, default: '', required: true },
  contactList: { type: String, default: '', },
  gstin: { type: String, default: '', required: true },
  whatsappNumber: { type: String, default: '', required: true },
  experience: { type: String, default: '', required: true },
  openingHours: [
    {
      day: { type: String },
      open: { type: String },
      close: { type: String },
      isClosed: { type: Boolean, default: false }
    }
  ],
  restaurantOptions: { type: String, default: '', },
  location: { type: String, default: '', required: true },
  category: { type: String, default: '', required: true },
  bannerImageKey: { type: String, default: '' },
  businessImagesKey: [{ type: String, default: '' }],
  googleMap: { type: String, default: '', },
  website: { type: String, default: '', },
  facebook: { type: String, default: '', },
  instagram: { type: String, default: '', },
  youtube: { type: String, default: '', },
  pinterest: { type: String, default: '', },
  twitter: { type: String, default: '', },
  linkedin: { type: String, default: '', },
  businessDetails: { type: String, default: '', },
  globalAddress: { type: String, default: '', },
  ratings: {
    type: [Number],
    default: [],
  },
  ratingExperience: { type: String, default: '', },
  ratingLove: { type: String, default: '', },
  ratingPhotos: [{ type: String, default: '' }],
  averageRating: {
    type: Number,
    default: 0,
  }, createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  activeBusinesses: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
});

export default businessListSchema;