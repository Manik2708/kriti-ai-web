import mongoose from 'mongoose';
import {ProjectModel} from "./project";

export interface UserModel extends mongoose.Document {
    name: string;
    email: string;
    isEmailVerified: boolean;
    projects: ProjectModel[];
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
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        default: [],
    }]
});

userSchema.index({ email: 'text' });
export const User = mongoose.model('User', userSchema);