export interface PubSubFactory {
    init(): void
    deploy(id: string): void
    undeploy(id: string): void
}