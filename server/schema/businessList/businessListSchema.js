import mongoose from "mongoose"




const reviewSchema = new mongoose.Schema({
  // Store the numerical rating
  rating: {
    type: Number,
    required: true,
    min: 0.5,
    max: 5
  },
  // Store the user's written experience
  ratingExperience: {
    type: String,
    required: true,
    trim: true
  },
  // Store the user's selected tags/likes
  ratingLove: {
    type: [String], // Array of strings for multiple tags
    default: []
  },
  // Store the user's ID and Username for display
  userId: { // Recommended: Store the user's ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
            default: null, // Set default to null if it's missing
 // Reference to your User model if you have one
  },
  username: { // Store the username directly
    type: String,
    trim: true
  },
  // Store the photo URLs
  ratingPhotos: [{
    type: String,
    default: ''
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  // You can add more fields like 'helpfulCount', 'flagged', etc.
});


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
  reviews: {
    type: [reviewSchema], // An array of Review subdocuments
    default: []
  },

  averageRating: {
    type: Number,
    default: 0,
  }, createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  activeBusinesses: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
});

export default businessListSchema;