import {User} from "../schema/user";
import {BadRequestError, InternalServerError, UnauthorizedError} from "../errors/errors";
import {Project, ProjectModel} from "../schema/project";

export interface ProjectServiceTemplate {
    getProjects(user_id: string): Promise<ProjectModel[]>
    createProject(user_id: string, title: string, description: string, link: string): Promise<ProjectModel>
    updateProject(user_id: string, project: ProjectModel): Promise<ProjectModel>
    deleteProject(user_id: string, project_id: string): Promise<ProjectModel>
}

export class ProjectService implements ProjectServiceTemplate {
    async getProjects(user_id: string): Promise<ProjectModel[]> {
        const user = await User.findById(user_id).populate("projects");
        if (!user) {
            throw new BadRequestError('User not found');
        }
        return user.projects
    }
    async createProject(user_id: string, title: string, description: string, link: string): Promise<ProjectModel> {
        const project = new Project({
            user_id: user_id,
            title: title,
            description: description,
            link: link,
            last_edited: new Date(),
        })
        return project.save()
    }
    async updateProject(user_id: string, project: ProjectModel): Promise<ProjectModel> {
        const project_model = await Project.findById(project._id);
        if (!project_model) {
            throw new BadRequestError('Project not found');
        }
        if (project_model.user_id != user_id) {
            throw new UnauthorizedError("You are not the owner of this project");
        }
        const updated_project = await Project.findByIdAndUpdate(project._id, project_model, { new: true })
        if (!updated_project) {
            throw new InternalServerError("Project not found");
        }
        return updated_project;
    }
    async deleteProject(user_id: string, project_id: string): Promise<ProjectModel> {
        const project_model = await Project.findById(project_id);
        if (!project_model) {
            throw new BadRequestError('Project not found');
        }
        if (project_model.user_id != user_id) {
            throw new UnauthorizedError("You are not the owner of this project");
        }
        const user = await User.findByIdAndUpdate(user_id, {
            $pull: {
                project: project_id,
            }
        })
        if (!user) {
            throw new BadRequestError('User not found');
        }
        const deleted_project = await Project.findByIdAndDelete(project_model._id);
        if (!deleted_project) {
            throw new InternalServerError("Project not found");
        }
        return deleted_project
    }
}