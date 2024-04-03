import mongoose from 'mongoose';

const useSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Emial is required'],
        unique: true
    },
    emailValidated: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: {
        type: String,
    },
    role: {
        type: [String],
        default: ['USER_ROLE'],
        required: [true, 'Role is required'],
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
})

export const UserModel = mongoose.model('User', useSchema);