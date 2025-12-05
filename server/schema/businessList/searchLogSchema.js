import mongoose from "mongoose"

const searchLogSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        index: true
    },
     searchedUserText: {
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
        expires: 604800 
    }
});

export default searchLogSchema;