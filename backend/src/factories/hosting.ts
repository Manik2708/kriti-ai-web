export interface HostingFactory {
    deploy(site_id: string, content: string): Promise<void>;
}