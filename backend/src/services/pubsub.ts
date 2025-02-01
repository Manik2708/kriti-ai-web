import {PubSubFactory} from "../factories/pubsub";
import EventEmitter from "events";
import {Project} from "../schema/project";
import logger from "../logger";
import {HostingFactory} from "../factories/hosting";
import {Environment} from "../env";

export class PubSub implements PubSubFactory {
    private static DEPLOY: string = "deploy"
    private static UNDEPLOY: string = "undeploy"
    constructor(private readonly emitter: EventEmitter, private readonly services: HostingFactory) {}
    init(): void {
        this.emitter.on(PubSub.DEPLOY, async (id: string) => {
            try{
                logger.info("Listening on PubSub for Project", id);
                let project = await Project.findById(id)
                if (!project) {
                    logger.info(`PubSub project ${id} not found`)
                    return
                }
                try {
                    await this.services.deploy(project._id.toString(), project.non_editable_file)
                    await Project.findByIdAndUpdate(id, {
                        deployment_link: "https://"+Environment.GITHUB_NAME+".github.io/"+id,
                        deployment_error: null,
                        status: 'DEPLOYED',
                    })
                }catch(err) {
                    logger.info(`Error while deploying to github pages`, JSON.stringify(err));
                    await Project.findByIdAndUpdate(id, {
                        deployment_link: null,
                        deployment_error: "Can't deploy, please try again",
                        status: 'NOTDEPLOYED',
                    })
                }
            }catch(error){
                logger.error(`PubSub project ${id} error: ${JSON.stringify(error)}`);
            }
        })
    }
    deploy(id: string): void {
        this.emitter.emit(PubSub.DEPLOY, id)
    }
    undeploy(id: string): void {
        this.emitter.emit(PubSub.UNDEPLOY, id)
    }
}