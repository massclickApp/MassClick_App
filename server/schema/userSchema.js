import mongoose, { Schema } from 'mongoose'; 
const userSchema = new mongoose.Schema({
    userName: { type: String, default: '', isUnique: true, required: true },
    userProfileKey: { type: String, default: '', },
    contact: { type: String, default: '', },
    role: { type: String, default: '', required: true },
managedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    },  
    salesBy: [
  {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
]
,
 businessLocation: { type: String, default: '', isUnique: true, required: true },
    businessCategory: { type: String, default: '', isUnique: true, required: true },
    password: { type: String, default: '', },
    emailId: { type: String, default: '', isUnique: true, required: true },
    forgotPassword: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
});

export default userSchema;