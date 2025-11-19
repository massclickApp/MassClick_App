import mongoose from "mongoose"

const searchLogSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        index: true
    },
    location: {
        type: String,
        index: true
    },
    userDetails: [
        {
            userName: String,
            mobileNumber1: String,
            mobileNumber2: String,
            email: String
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d'
    }
});

export default searchLogSchema;