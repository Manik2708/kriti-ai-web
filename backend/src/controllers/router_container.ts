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

export class GlobalRouterRegister {
    constructor(private routers: ControllerRegister[]) {}
    registerAllRoutes = (app: express.Application) => {
        for (const router of this.routers) {
            const obj = router.registerRouter();
            logger.info(`Added routes for path: ${obj.path}`);
            app.use(obj.path, obj.router);
        }
    }
}

const object = new ControllerTemplate()

const controllers = [
    new UserController(new UserService(), object),
    new ProjectController(new ProjectService(), object),
    new MessageController(new MessageService(), object),
];

export const globalRouterContainer = new GlobalRouterRegister(controllers);
