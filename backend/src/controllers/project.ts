import {ControllerRegister, RouterRegistrar} from "./controller_register";
import express from "express";
import {handleError} from "../errors/error_handler";
import {ControllerTemplate, RequestMethodTypes} from "./controller_template";
import {ProjectServiceFactory} from "../factories/project";

export class ProjectController implements ControllerRegister{
    constructor(private readonly projectService: ProjectServiceFactory) {}
    private async createProject(req: express.Request, res: express.Response){
        try{
           const {title, description, link} = req.body;
           const project = await this.projectService.createProject(req.id!, title, description, link);
           return res.status(201).json(project);
        }catch(e){
            handleError(e, res)
        }
    }
    private async getProjects(req: express.Request, res: express.Response){
        try {
            const projects = this.projectService.getProjects(req.id!);
            return res.status(200).json(projects);
        }catch(e){
            handleError(e, res)
        }
    }
    private async updateProject(req: express.Request, res: express.Response){
        try{
            const {projectModel} = req.body;
            const project = await this.projectService.updateProject(req.id!, projectModel);
            return res.status(200).json(project);
        }catch(e){
            handleError(e, res)
        }
    }
    private async deleteProject(req: express.Request, res: express.Response){
        try{
            const {projectId} = req.params;
            const project = await this.projectService.deleteProject(req.id!, projectId);
            return res.status(200).json(project);
        }catch(e){
            handleError(e, res)
        }
    }
    registerRouter(): RouterRegistrar {
        const router = express.Router();
        const object = new ControllerTemplate(router);
        object.addControllerWithAuthMiddleware("/", RequestMethodTypes.GET, this.getProjects)
        object.addControllerWithAuthMiddleware("/", RequestMethodTypes.POST, this.createProject)
        object.addControllerWithAuthMiddleware("/", RequestMethodTypes.PUT, this.updateProject)
        object.addControllerWithAuthMiddleware("/:projectId", RequestMethodTypes.DELETE, this.deleteProject)
        return {
            router: router,
            path: '/project'
        }
    }
}