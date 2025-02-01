import {HostingFactory} from "../factories/hosting";
import {Environment} from "../env";
import {Octokit} from "@octokit/core"
import logger from "../logger";

export class HostingServices implements HostingFactory {
    constructor(private readonly client: Octokit){}
    deploy = async (project_id: string, content: string): Promise<void> => {
        let repoExists: boolean
        try {
            await this.client.request('GET /repos/{owner}/{repo}', {
                owner: Environment.GITHUB_NAME,
                repo: project_id,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            repoExists = true;
        }catch(err){
            repoExists = false;
            await this.client.request('POST /user/repos', {
                name: project_id,
                description: "Repository description",
                private: false,
                auto_init: true,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
        }
        const blob = await this.client.request('POST /repos/{owner}/{repo}/git/blobs', {
            owner: Environment.GITHUB_NAME,
            repo: project_id,
            content: content,
            encoding: 'utf-8',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        const main_branch = await this.client.request('GET /repos/{owner}/{repo}/branches/main', {
            owner: Environment.GITHUB_NAME,
            repo: project_id,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        const last_commit_sha = main_branch.data.commit.sha;
        const tree = await this.client.request("POST /repos/{owner}/{repo}/git/trees", {
            owner: Environment.GITHUB_NAME,
            repo: project_id,
            base_tree: last_commit_sha,
            tree: [{
                path: "index.html",
                mode: "100644",
                type: "blob",
                sha: blob.data.sha
            }]
        });
        const new_commit = await this.client.request('POST /repos/{owner}/{repo}/git/commits', {
            owner: Environment.GITHUB_NAME,
            repo: project_id,
            message: "Initial commit",
            author: {
                name: Environment.GITHUB_NAME,
                email: Environment.GITHUB_EMAIL,
                date: new Date().toISOString()
            },
            parents: [last_commit_sha],
            tree: tree.data.sha,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        await this.client.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
            owner: Environment.GITHUB_NAME,
            repo: project_id,
            ref: 'heads/main',
            sha: new_commit.data.sha,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        if(!repoExists) {
            try {
                await this.client.request('POST /repos/{owner}/{repo}/pages', {
                    owner: Environment.GITHUB_NAME,
                    repo: project_id,
                    source: {
                        branch: "main",
                        path: `/`
                    },
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                })
            }catch (e) {
                logger.error("Error while creating pages: ", JSON.stringify(e));
            }
        }
    }
}