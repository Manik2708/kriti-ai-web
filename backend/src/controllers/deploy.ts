import {ControllerRegister, RouterRegistrar} from "./controller_register";
import express from "express";
import {handleError} from "../errors/error_handler";
import {DeploymentFactory} from "../factories/deploy";
import {ControllerTemplateFactory} from "../factories/controller_factory";
import {RequestMethodTypes} from "./controller_template";

export class DeployController implements ControllerRegister {
    constructor(private readonly services: DeploymentFactory, private readonly object: ControllerTemplateFactory) {}
    registerRouter(): RouterRegistrar {
        const router  = express.Router();
        this.object.addControllerWithAuthMiddleware(router, "/", RequestMethodTypes.POST, this.deploy)
        return {
            router: router,
            path: "/deploy",
        }
    }
    private deploy = async (req: express.Request, res: express.Response) => {
        try {
            const {project_id} = req.body;
            const project = await this.services.deploy(req.id!, project_id);
            return res.status(200).json(project);
        }catch (error) {
            handleError(error, res)
        }
    }
}