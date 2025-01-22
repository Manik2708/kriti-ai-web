import express from "express";
import {handleError} from "../errors/error_handler";
import {ControllerRegister, RouterRegistrar} from "./controller_register";
import {ControllerTemplate, RequestMethodTypes} from "./controller_template";
import {UserServiceFactory} from "../factories/user";

export class UserController implements ControllerRegister {
    constructor(private readonly userService: UserServiceFactory) {}
    private async signUpController(req: express.Request, res: express.Response){
        try {
            const {email, password, name} = req.body;
            const user = await this.userService.signUp(name, password, email)
            return res.status(200).json(user)
        }catch(err){
            handleError(err, res)
        }
    }
    private async loginController(req: express.Request, res: express.Response){
        try {
            const {email, password} = req.body;
            const user = await this.userService.login(email, password)
            return res.status(200).json(user)
        }catch(err){
            handleError(err, res)
        }
    }
    registerRouter(): RouterRegistrar {
        const router = express.Router();
        const object = new ControllerTemplate(router);
        object.addControllerWithoutMiddleware("/signup", RequestMethodTypes.POST, this.signUpController)
        object.addControllerWithoutMiddleware("/login", RequestMethodTypes.POST, this.loginController)
        return {
            router: router,
            path: '/user'
        }
    }
}