import {ControllerRegister} from "./controller_register";
import express from "express";
import {UserController} from "./user";
import {UserService} from "../services/user";
import {EmailSenderService} from "../services/email_sender";
import {OtpController} from "./otp";
import {OtpService} from "../services/otp";
import {ProjectController} from "./project";
import {ProjectService} from "../services/project";
import logger from "../logger";

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

const controllers = [
    new UserController(new UserService()),
    new OtpController(new OtpService(new EmailSenderService())),
    new ProjectController(new ProjectService()),
];

export const globalRouterContainer = new GlobalRouterRegister(controllers);
