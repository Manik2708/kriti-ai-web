import {ControllerRegister} from "./controller_register";
import express from "express";
import {ProjectController} from "./project";
import {ProjectService} from "../services/project";
import logger from "../logger";
import {ControllerTemplate} from "./controller_template";
import {UserController} from "./user";
import {UserService} from "../services/user";
import {MessageController} from "./message";
import {MessageService} from "../services/message";
import Anthropic from "@anthropic-ai/sdk";
import {PromptController} from "./prompt";

export class GlobalRouterRegister {
    constructor(private readonly object: ControllerTemplate, private readonly client: Anthropic) {}
    private routers: ControllerRegister[] = [
        new UserController(new UserService(), this.object),
        new ProjectController(new ProjectService(), this.object),
        new MessageController(new MessageService(), this.object),
        new PromptController(this.client, this.object),
    ];
    registerAllRoutes = (app: express.Application) => {
        for (const router of this.routers) {
            const obj = router.registerRouter();
            logger.info(`Added routes for path: ${obj.path}`);
            app.use(obj.path, obj.router);
        }
    }
}
