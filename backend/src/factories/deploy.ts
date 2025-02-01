export interface DeploymentFactory {
    deploy(project_id: string): Promise<void>
    undeploy(project_id: string): Promise<void>
}