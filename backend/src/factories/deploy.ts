import {ProjectModel} from "../schema/project";

export interface DeploymentFactory {
    deploy(user_id: string, project_id: string): Promise<ProjectModel>
    undeploy(user_id: string, project_id: string): Promise<ProjectModel>
}