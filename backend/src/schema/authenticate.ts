import mongoose from "mongoose";

export interface AuthenticationModel extends mongoose.Document {
    email: string;
    user_id: string;
    password: string;
}

const authenticationSchema = new mongoose.Schema<AuthenticationModel>({
    email: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

authenticationSchema.index({ email: 'text' });
export const Authentication = new mongoose.Model('Authentication', authenticationSchema);

