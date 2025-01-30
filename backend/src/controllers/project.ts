import {ControllerRegister, RouterRegistrar} from "./controller_register";
import express from "express";
import {getBadRequestErrorObject, handleError} from "../errors/error_handler";
import {RequestMethodTypes} from "./controller_template";
import {ProjectServiceFactory} from "../factories/project";
import {ControllerTemplateFactory} from "../factories/controller_factory";

export class ProjectController implements ControllerRegister{
    constructor(private readonly projectService: ProjectServiceFactory, private readonly object: ControllerTemplateFactory) {}
    private createProject = async (req: express.Request, res: express.Response) => {
        try{
           const {title, description} = req.body;
           const project = await this.projectService.createProject(req.id!, title, description);
           return res.status(201).json(project);
        }catch(e){
            handleError(e, res)
        }
    }
    private getProjects = async (req: express.Request, res: express.Response) => {
        try {
            const project_id = req.query.projectId;
            if (typeof project_id !== "string") {
                const {statusCode, ...object} = getBadRequestErrorObject(new Error("Invalid project"));
                return res.status(statusCode).json(object);
            }
            const projects = await this.projectService.getProject(req.id!, project_id);
            return res.status(200).json(projects);
        }catch(e){
            handleError(e, res)
        }
    }
    private updateProject = async (req: express.Request, res: express.Response) => {
        try{
            const {user_id, project_id, editable_file, non_editable_file} = req.body;
            const project = await this.projectService.updateProject(user_id, project_id, editable_file, non_editable_file);
            return res.status(200).json(project);
        }catch(e){
            handleError(e, res)
        }
    }
    private deleteProject = async (req: express.Request, res: express.Response) => {
        try{
            const {projectId} = req.params;
            const project = await this.projectService.deleteProject(req.id!, projectId);
            return res.status(200).json(project);
        }catch(e){
            handleError(e, res)
        }
    }
    registerRouter = (): RouterRegistrar => {
        const router = express.Router();
        this.object.addControllerWithAuthMiddleware(router, "/", RequestMethodTypes.GET, this.getProjects)
        this.object.addControllerWithAuthMiddleware(router, "/", RequestMethodTypes.POST, this.createProject)
        this.object.addControllerWithoutMiddleware(router, "/update", RequestMethodTypes.POST, this.updateProject)
        this.object.addControllerWithoutMiddleware(router, "/:projectId", RequestMethodTypes.DELETE, this.deleteProject)
        return {
            router: router,
            path: '/project'
        }
    }
}