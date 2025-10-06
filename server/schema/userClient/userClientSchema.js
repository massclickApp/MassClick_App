import mongoose from "mongoose"

const userClientSchema = new mongoose.Schema({
    clientId: { type: String, default: '', isUnique: true },
    name: { type: String, default: '', isUnique: true, required: true },
    contact: { type: String, default: '', },
    emailId: { type: String, default: '', isUnique: true, required: true },
    businessName: { type: String, default: '', isUnique: true, required: true },
    businessAddress: { type: String, default: '', isUnique: true, required: true },
    isActive: { type: Boolean, default: true },
});

export default userClientSchema;