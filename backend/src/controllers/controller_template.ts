import express from 'express'
import logger from "../logger";
import {ControllerTemplateFactory, ControllerType} from "../factories/controller_factory";
import {getAuth, requireAuth} from "@clerk/express";
import {BadRequestError} from "../errors/errors";
import {User} from "../schema/user";
import {handleError} from "../errors/error_handler";

export type middlewareType = (req: express.Request, res: express.Response, next: express.NextFunction) => void

export class RequestMethodTypes {
   static GET: string = 'GET'
   static POST: string = 'POST'
   static PUT: string = 'PUT'
   static DELETE: string = 'DELETE'
}

export class ControllerTemplate implements ControllerTemplateFactory{
    constructor() {}
    addControllerWithAuthMiddleware = (router: express.Router, path: string, method: RequestMethodTypes, controllerType: ControllerType) => {
        const middlewares: middlewareType[] = [
            requireAuth(),
            this.authenticationMiddleware,
            controllerType
        ]
        this.addControllerWithMiddleware(router, path, method, middlewares)
        logger.info(`Adding ${method} controller with AuthMiddleware with path: ${path}`);
    }
    addControllerWithoutMiddleware = (router: express.Router, path: string, method: RequestMethodTypes, controllerType: ControllerType) => {
        logger.info(`Adding ${method} controller without middleware with path: ${path}`);
        const middlewares: middlewareType[] = [
            controllerType
        ]
        this.addControllerWithMiddleware(router, path, method, middlewares)
    }
    getClerkUserId = (req: express.Request): string => {
        const auth = getAuth(req)
        if (!auth.userId) throw new BadRequestError("No id retrieved from authentication");
        return auth.userId;
    }
    private authenticationMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await this.authenticate(req)
            return next()
        }catch(err){
            handleError(err, res);
        }
    }
    private authenticate = async (req: express.Request) => {
        const id = this.getClerkUserId(req)
        const user = await User.findOne({
            clerk_user_id: id
        })
        if (!user) throw new BadRequestError("User not found");
        req.id = user._id.toString();
    }
    private addControllerWithMiddleware = (router: express.Router, path: string, method: RequestMethodTypes, middlewares: middlewareType[]) => {
        switch (method) {
            case RequestMethodTypes.POST:
                router.post(path, ...middlewares);
                break;
            case RequestMethodTypes.PUT:
                router.put(path, ...middlewares);
                break;
            case RequestMethodTypes.DELETE:
                router.delete(path, ...middlewares);
                break;
            case RequestMethodTypes.GET:
                router.get(path, ...middlewares);
                break;
            default:
                throw new Error(`Unsupported method`);
        }
    }
}