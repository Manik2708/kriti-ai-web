import {DeploymentFactory} from "../factories/deploy";

export class DeploymentService implements DeploymentFactory {
    deploy(project_id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {

        })
    }
    undeploy(project_id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}