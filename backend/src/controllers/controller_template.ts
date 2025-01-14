import express from 'express'
import {handleError} from "../errors/error_handler";
import {BadRequestError, UnauthorizedError} from "../errors/errors";
import jwt from "jsonwebtoken";
import {Environment} from "../env";
import {User} from "../schema/user";
import logger from "../logger";

type controllerType = (req: express.Request, res: express.Response) => void
type middlewareType = (req: express.Request, res: express.Response, next: express.NextFunction) => void

export class RequestMethodTypes {
   static GET: string = 'GET'
   static POST: string = 'POST'
   static PUT: string = 'PUT'
   static DELETE: string = 'DELETE'
}

export class ControllerTemplate {
    constructor(private readonly router: express.Router) {}
    addControllerWithAuthMiddleware(path: string, method: RequestMethodTypes, controllerType: controllerType){
        this.addControllerWithMiddleware(path, method, this.authMiddleware, controllerType)
        logger.info(`Adding ${method} controller with AuthMiddleware with path: ${path}`);
    }
    addControllerWithoutMiddleware(path: string, method: RequestMethodTypes, controllerType: controllerType){
        logger.info(`Adding ${method} controller without middleware with path: ${path}`);
        switch (method) {
            case RequestMethodTypes.POST:
                this.router.post(path, controllerType);
                break;
            case RequestMethodTypes.PUT:
                this.router.put(path, controllerType);
                break;
            case RequestMethodTypes.DELETE:
                this.router.delete(path, controllerType);
                break;
            case RequestMethodTypes.GET:
                this.router.get(path, controllerType);
                break;
            default:
                throw new Error(`Unsupported method`);
        }
    }
    private addControllerWithMiddleware(path: string, method: RequestMethodTypes, middleware: middlewareType, controllerType: controllerType){
        switch (method) {
            case RequestMethodTypes.POST:
                this.router.post(path, middleware, controllerType);
                break;
            case RequestMethodTypes.PUT:
                this.router.put(path, middleware, controllerType);
                break;
            case RequestMethodTypes.DELETE:
                this.router.delete(path, middleware, controllerType);
                break;
            case RequestMethodTypes.GET:
                this.router.get(path, middleware, controllerType);
                break;
            default:
                throw new Error(`Unsupported method`);
        }
    }
    private authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            req.id = await this.authenticate(req.header("token"));
            return next();
        }catch (e) {
            handleError(e, res)
        }
    }
    private authenticate = async (header: any): Promise<string> => {
        const token: any = header;
        if (token == null || token.toString().trim().length == 0) {
            throw new UnauthorizedError("No token provided");
        }
        if (token.toString().includes(' ')) {
            throw new UnauthorizedError("Invalid token provided");
        }
        const decode = jwt.verify(token, Environment.JSON_SECRET_KEY);
        const id = (decode as jwt.JwtPayload).id;
        if (!id) throw new UnauthorizedError("Invalid token provided");
        const user = await User.findById(id);
        if (!user) {
            throw new BadRequestError("User does not exist");
        }
        return id;
    }
}