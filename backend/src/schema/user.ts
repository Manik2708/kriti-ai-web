import mongoose from 'mongoose';

export interface UserModel extends mongoose.Document {
    name: string;
    email: string;
    isEmailVerified: boolean;
    projects: string[]
    _doc?: any;
}

const userSchema = new mongoose.Schema<UserModel>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    projects: {
        type: [String],
        required: true,
        default: [],
    }
});

userSchema.index({ email: 'text' });
export const User = mongoose.model('User', userSchema);