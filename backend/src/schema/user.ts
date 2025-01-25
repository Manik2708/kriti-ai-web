import mongoose from 'mongoose';
import {ProjectModel} from "./project";

export interface UserModel {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    clerk_user_id: string;
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
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        default: [],
    }],
    clerk_user_id: {
        type: String,
        required: true,
    }
});

userSchema.index({ clerk_user_id: 'text' });
export const User = mongoose.model('User', userSchema);