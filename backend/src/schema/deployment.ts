import mongoose from "mongoose";

export interface DeploymentModel {
    _id: mongoose.Types.ObjectId,
    project_id: string,
    site_id: string,
    error: string,
}

const deploymentSchema = new mongoose.Schema<DeploymentModel>({
    site_id: {
        type: String,
        required: true,
    },
    error: {
        type: String,
        default: null,
    },
    project_id: {
        type: String,
        required: true,
    }
})

deploymentSchema.index({ project_id: 'text' });
export const Deployment = mongoose.model('Deployment', deploymentSchema);