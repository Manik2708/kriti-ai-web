import {User} from "../schema/user";
import {BadRequestError, InternalServerError, UnauthorizedError} from "../errors/errors";
import {Project, ProjectModel} from "../schema/project";
import {ProjectServiceFactory} from "../factories/project";

export class ProjectService implements ProjectServiceFactory {
    async getProject(user_id: string, project_id: string): Promise<ProjectModel> {
        const project = await Project.findOne({
            _id: project_id,
            user_id: user_id,
        }).populate({
            path: "messages",
            select: "-website_content"
        })
        if (!project) throw new BadRequestError("No project found with this project and user id")
        return project;
    }
    async createProject(user_id: string, title: string, description: string): Promise<ProjectModel> {
        let project = new Project({
            user_id: user_id,
            title: title,
            description: description,
            last_edited: new Date(),
            status: 'NOTDEPLOYED'
        })
        project = await project.save()
        await User.findByIdAndUpdate(user_id, {
            $push: {
                projects: project._id
            }
        })
        return project;
    }
    async updateProject(user_id: string, project_id: string, editable_file: string, non_editable_file: string): Promise<ProjectModel> {
        const project_model = await Project.findById(project_id);
        if (!project_model) {
            throw new BadRequestError('Project not found');
        }
        const user = await User.findOne({
            clerk_user_id: user_id
        })
        if (project_model.user_id !== user._id.toString()) {
            throw new BadRequestError('You are not the owner of the project');
        }
        const updated_project = await Project.findByIdAndUpdate(project_id, {
            $set: {
                editable_file: editable_file,
                non_editable_file: non_editable_file
            }
        },
            {
                new: true
            }
        )
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