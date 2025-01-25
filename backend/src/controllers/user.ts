import {ControllerRegister, RouterRegistrar} from "./controller_register";
import express from "express";
import {ControllerTemplateFactory} from "../factories/controller_factory";
import {UserServiceFactory} from "../factories/user";
import {handleError} from "../errors/error_handler";
import {RequestMethodTypes} from "./controller_template";

export class UserController implements ControllerRegister {
    constructor(private readonly userService: UserServiceFactory, private readonly object: ControllerTemplateFactory) {}
    registerRouter = (): RouterRegistrar => {
        const router = express.Router();
        this.object.addControllerWithoutMiddleware(router, "/", RequestMethodTypes.POST, this.saveUser)
        this.object.addControllerWithAuthMiddleware(router, "/projects", RequestMethodTypes.GET, this.getProjects)
        return {
            router: router,
            path: "/user",
        }
    }
    private saveUser = async (req: express.Request, res: express.Response) => {
        try {
            const {name, email, clerk_user_id} = req.body;
            const user = await this.userService.saveUser(name, email, clerk_user_id)
            return res.status(200).json(user);
        }catch(err){
            handleError(err, res)
        }
    }
    private getProjects = async (req: express.Request, res: express.Response) => {
        try {
            const projects = await this.userService.getProjects(req.id!)
            return res.status(200).json(projects);
        }catch (err) {
            handleError(err, res)
        }
    }
}