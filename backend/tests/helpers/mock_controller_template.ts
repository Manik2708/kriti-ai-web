import { Router } from "express";
import {middlewareType, RequestMethodTypes} from "../../src/controllers/controller_template";
import {ControllerTemplateFactory, ControllerType} from "../../src/factories/controller_factory";
import express from "express";

export const mockClerkId: string = "mockClerkId";
export const mockUserId: string = "mockUserId";

export class MockControllerTemplate implements ControllerTemplateFactory {
    addControllerWithoutMiddleware = (router: express.Router, path: string, method: RequestMethodTypes, controllerType: ControllerType): void => {
        this.addControllerWithMiddleware(router, path, method, [controllerType])
    }
    addControllerWithAuthMiddleware = (router: Router, path: string, method: RequestMethodTypes, controllerType: ControllerType): void => {
        const middlewares = [
            this.mockMiddleware,
            controllerType
        ]
        this.addControllerWithMiddleware(router, path, method, middlewares)
    }
    getClerkUserId = (req: express.Request): string => {
        return mockClerkId;
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
    private mockMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.id = mockUserId
        return next();
    }
}