import express from "express";
import {RequestMethodTypes} from "../controllers/controller_template";

export type ControllerType = (req: express.Request, res: express.Response) => void

export interface ControllerTemplateFactory {
    addControllerWithAuthMiddleware(router: express.Router, path: string, method: RequestMethodTypes, controllerType: ControllerType): void
    addControllerWithoutMiddleware(router: express.Router, path: string, method: RequestMethodTypes, controllerType: ControllerType): void
    getClerkUserId(req: express.Request): string
}