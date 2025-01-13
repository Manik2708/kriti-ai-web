import mongoose from "mongoose";

export interface ProjectModel extends mongoose.Document {
    title: string;
    description: string;
    link: string;
    user_id: string;
    last_edited: Date;
}

const projectSchema = new mongoose.Schema<ProjectModel>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    last_edited: {
        type: Date,
        required: true,
    }
})

projectSchema.index({ user_id: 'text' });
export const Project = new mongoose.Model('Project', projectSchema);

