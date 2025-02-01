import {PubSubFactory} from "../factories/pubsub";
import EventEmitter from "events";
import {Project} from "../schema/project";
import logger from "../logger";
import {Deployment, DeploymentModel} from "../schema/deployment";
import {HostingFactory} from "../factories/hosting";

export class PubSub implements PubSubFactory {
    private static DEPLOY: string = "deploy"
    private static UNDEPLOY: string = "undeploy"
    constructor(private readonly emitter: EventEmitter, private readonly services: HostingFactory) {}
    init(): void {
        this.emitter.on(PubSub.DEPLOY, async (id: string) => {
            const project = await Project.findById(id)
            if (!project) {
                logger.info(`PubSub project ${id} not found`)
                return
            }
            let site_id: string
            let deploymentModel: DeploymentModel
            if (project.deployment_id === null || project.deployment_id === undefined) {
                try {
                    site_id = await this.services.createSite(project.title)
                }catch(err) {
                    if (err instanceof Error) {
                        logger.error(err.message)
                    }
                    return
                }
                let deployment = new Deployment({
                    site_id: site_id,
                    project_id: project._id.toString(),
                })
                deploymentModel = await deployment.save()
            }else{
                const deployment = await Deployment.findOne({
                    project_id: project._id.toString(),
                })
                if (!deployment) {
                    logger.error(`PubSub deployment for project ${id} not found`)
                    return
                }
                deploymentModel = deployment
                site_id = deployment.site_id
            }
            const jsonContent = project.non_editable_file
            const content = JSON.parse(jsonContent)
            const deployedStatus = await this.services.deploy(site_id, content)
            if (deployedStatus.status != 200) {
                await Deployment.findByIdAndUpdate(deploymentModel._id, {
                    error: deployedStatus.message
                })
            }
        })
        this.emitter.on(PubSub.UNDEPLOY, async (id: string) => {

        })
    }
    deploy(id: string): void {
        this.emitter.emit(PubSub.DEPLOY, id)
    }
    undeploy(id: string): void {
        this.emitter.emit(PubSub.UNDEPLOY, id)
    }
}