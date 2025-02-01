export interface HostingFactory {
    createSite(name: string): Promise<string>
    deploy(site_id: string, content: string): Promise<{ status: number, message: string }>;
}