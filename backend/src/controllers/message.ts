import {ControllerRegister, RouterRegistrar} from "./controller_register";
import {MessageFactory} from "../factories/message";
import {ControllerTemplateFactory} from "../factories/controller_factory";
import express from "express";
import {handleError} from "../errors/error_handler";
import {RequestMethodTypes} from "./controller_template";

export class MessageController implements ControllerRegister {
    constructor(private readonly messageService: MessageFactory, private readonly object: ControllerTemplateFactory) {}
    registerRouter(): RouterRegistrar {
        const router = express.Router();
        this.object.addControllerWithAuthMiddleware(router, "/", RequestMethodTypes.GET, this.get)
        this.object.addControllerWithAuthMiddleware(router, "/", RequestMethodTypes.POST, this.create)
        return {
            router: router,
            path: "/message",
        }
    }
    private create = async (req: express.Request, res: express.Response) => {
        try {
            const {user_id, project_id, message, website_content, user_type} = req.body;
            const messageModel = await this.messageService.create(user_id, project_id, message, website_content, user_type);
            return res.status(201).json(messageModel);
        }catch(err){
            handleError(err, res);
        }
    }
    private get = async (req: express.Request, res: express.Response) => {
        try {
           const {project_id, message_id} = req.body;
           const message = await this.messageService.get(req.id!, project_id, message_id);
           return res.status(200).json(message);
        }catch(err){
            handleError(err, res);
        }
    }
}