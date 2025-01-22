import mongoose from "mongoose";

export interface MessageModel extends mongoose.Document {
    project_id: string;
    message: string;
    user_type: UserType;
    website_content?: string;
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

type UserType = 'USER' | 'AI';
export const Message = mongoose.model('Message', messageSchema);