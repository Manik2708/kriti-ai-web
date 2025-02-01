import {HostingFactory} from "../factories/hosting";
import {InternalServerError} from "../errors/errors";
import {Environment} from "../env";
import * as crypto from "node:crypto";
import logger from "../logger";
import axios from "axios";

export class FirebaseServices implements HostingFactory {
    private static Header = "Bearer "+ Environment.NETLIFY_TOKEN
    private static BASE_URL = "https://api.netlify.com/api/v1/"
    constructor() {}
    createSite = async (name: string): Promise<string> => {
        const url = FirebaseServices.BASE_URL + "sites"
        const response = await axios.post(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": FirebaseServices.Header
            },
            body: {
                name: name,
            }
        })
        if (response.status != 200) {
            throw new InternalServerError("Can't create the site")
        }
        const createSiteResponse = response.data as CreateSiteResponse;
        return createSiteResponse.id
    }
    deploy = async (site_id: string, content: string): Promise<{status: number, message: string}> => {
        const url = FirebaseServices.BASE_URL + site_id + "/" + "deploys"
        const hash = this.calculateSHA1(content)
        const initialResponse = await axios.post(url, {
            headers: {
                "Authorization": FirebaseServices.Header,
                "Content-Type": "application/json"
            },
            body: {
                "files": {
                    "index.html": hash,
                }
            }
        })
        if (initialResponse.status == 200) {
           let initialDeployment: InitialDeploymentResponse
           try {
               initialDeployment = initialResponse.data as InitialDeploymentResponse;
           }catch(err) {
               logger.error("Can't parse initial deployment response", err);
               return {
                   status: 500,
                   message: "Failed to parse initial deployment, please try again!",
               }
           }
           const deploymentUrl = FirebaseServices.BASE_URL + initialDeployment.id + "/files/index.html"
           const finalResponse = await axios.put(deploymentUrl, {
               headers: {
                   "Authorization": FirebaseServices.Header,
                   "Content-Type": "application/octet-stream"
               },
               body: content
           })
            if (finalResponse.status != 200) {
                logger.error("Error while uploading file to Netlify with status: "+JSON.stringify(finalResponse.statusText) + "and data: " + JSON.stringify(finalResponse.data))
                return {
                    status: finalResponse.status,
                    message: "Failed to deploy the website, please try again",
                }
            } else {
                // TODO: Poll the api to check the state of website
                return {
                    status: 200,
                    message: "Successfully uploaded the website"
                }
            }
        } else {
            logger.error("Initial response ended with status code: " + initialResponse.status + "and status: " + initialResponse.statusText + "and response: " + JSON.stringify(initialResponse.data))
            return {
                status: initialResponse.status,
                message: "Failed to create the site on netlify. Please try again"
            }
        }
    }
    private calculateSHA1 = (content: string): string => {
        return crypto.createHash('sha1')
            .update(content)
            .digest('hex');
    }
}

interface InitialDeploymentResponse {
    id: string;
    required: string[];
    required_functions: string[];
}

interface CreateSiteResponse {
    id: string;
}