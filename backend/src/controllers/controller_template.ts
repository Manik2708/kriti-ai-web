import express from 'express'
import {authMiddleware} from "../middlewares/auth";

type controllerType = (req: express.Request, res: express.Response) => void
type middlewareType = (req: express.Request, res: express.Response, next: express.NextFunction) => void

export class RequestMethodTypes {
   static GET: string = 'GET'
   static POST: string = 'POST'
   static PUT: string = 'PUT'
   static DELETE: string = 'DELETE'
}

export class ControllerTemplate {
    constructor(private readonly app: express.Application) {}
    init() {
        this.app.use(express.json())
    }
    addControllerWithAuthMiddleware(path: string, method: RequestMethodTypes, controllerType: controllerType){
        this.addControllerWithMiddleware(path, method, authMiddleware, controllerType)
    }
    addControllerWithoutMiddleware(path: string, method: RequestMethodTypes, controllerType: controllerType){
        switch (method) {
            case RequestMethodTypes.POST:
                this.app.post(path, controllerType);
                break;
            case RequestMethodTypes.PUT:
                this.app.put(path, controllerType);
                break;
            case RequestMethodTypes.DELETE:
                this.app.delete(path, controllerType);
                break;
            case RequestMethodTypes.GET:
                this.app.get(path, controllerType);
                break;
            default:
                throw new Error(`Unsupported method`);
        }
    }
    private addControllerWithMiddleware(path: string, method: RequestMethodTypes, middleware: middlewareType, controllerType: controllerType){
        switch (method) {
            case RequestMethodTypes.POST:
                this.app.post(path, middleware, controllerType);
                break;
            case RequestMethodTypes.PUT:
                this.app.put(path, middleware, controllerType);
                break;
            case RequestMethodTypes.DELETE:
                this.app.delete(path, middleware, controllerType);
                break;
            case RequestMethodTypes.GET:
                this.app.get(path, middleware, controllerType);
                break;
            default:
                throw new Error(`Unsupported method`);
        }
    }
}