import {ProjectModel} from "../schema/project";

export interface ProjectServiceFactory {
    getProjects(user_id: string): Promise<ProjectModel[]>
    createProject(user_id: string, title: string, description: string, editable_file: string, non_editable_file: string): Promise<ProjectModel>
    updateProject(user_id: string, project: ProjectModel): Promise<ProjectModel>
    deleteProject(user_id: string, project_id: string): Promise<ProjectModel>
}