import {DeploymentFactory} from "../factories/deploy";
import {Project, ProjectModel} from "../schema/project";
import {BadRequestError, InternalServerError, UnauthorizedError} from "../errors/errors";
import {PubSubFactory} from "../factories/pubsub";

export class DeploymentService implements DeploymentFactory {
    constructor(private readonly pubsub: PubSubFactory) {}
    deploy = async (user_id: string, project_id: string): Promise<ProjectModel> => {
        let project = await Project.findById(project_id)
        if (!project) {
            throw new BadRequestError("No project found")
        }
        if (project.user_id !== user_id) {
            throw new UnauthorizedError("You are not the owner of this project")
        }
        project = await Project.findByIdAndUpdate(project_id, {
            status: "DEPLOYING"
        })
        if (!project) {
            throw new InternalServerError(`Project with id ${project_id} not found`)
        }
        this.pubsub.deploy(project._id.toString())
        return project
    }
    undeploy(user_id: string, project_id: string): Promise<ProjectModel> {
        throw new Error("Method not implemented.");
    }
}