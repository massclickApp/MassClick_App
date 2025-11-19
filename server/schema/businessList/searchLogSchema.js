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
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d' 
    }
});

export default searchLogSchema;