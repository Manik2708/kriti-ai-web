import mongoose from "mongoose";
import {MessageModel} from "./message";

export interface ProjectModel {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    editable_file: string;
    non_editable_file: string;
    user_id: string;
    status: Status;
    deployment_link?: string;
    messages: MessageModel[];
    last_edited: Date;
    deployment_error?: string;
    _doc?: any
}

type Status = 'DEPOLOYED' | 'NOTDEPLOYED'

const projectSchema = new mongoose.Schema<ProjectModel>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    editable_file: {
        type: String,
        default: null,
    },
    non_editable_file: {
        type: String,
        default: null,
    },
    user_id: {
        type: String,
        required: true,
    },
    last_edited: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    deployment_link: {
        type: String,
        default: null,
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true,
        default: [],
    }],
    deployment_error: {
        type: String,
        default: null,
    }
})

projectSchema.index({ user_id: 'text' });
export const Project = mongoose.model('Project', projectSchema);

