import mongoose from "mongoose";

export interface MessageModel {
    _id: mongoose.Types.ObjectId;
    project_id: string;
    message: string;
    user_type: UserType;
    website_content?: string;
    _doc?: any;
}

const messageSchema = new mongoose.Schema<MessageModel>({
    project_id: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    user_type: {
        type: String,
        required: true,
    },
    website_content: {
        type: String,
        required: true,
        default: null,
    }
})

export type UserType = 'USER' | 'AI';
export const Message = mongoose.model('Message', messageSchema);