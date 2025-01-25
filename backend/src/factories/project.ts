import {ProjectModel} from "../schema/project";

export interface ProjectServiceFactory {
    getProject(user_id: string, project_id: string): Promise<ProjectModel>
    createProject(user_id: string, title: string, description: string): Promise<ProjectModel>
    updateProject(user_id: string, project: ProjectModel): Promise<ProjectModel>
    deleteProject(user_id: string, project_id: string): Promise<ProjectModel>
}