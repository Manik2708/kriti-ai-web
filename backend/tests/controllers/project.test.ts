import {describe, expect} from '@jest/globals';
import express from "express";
import {ProjectServiceFactory} from "../../src/factories/project";
import { ProjectModel } from '../../src/schema/project';
import {MockControllerTemplate, mockUserId} from "../helpers/mock_controller_template";
import {ProjectController} from "../../src/controllers/project";
import request from "supertest"
import randomstring from "randomstring";

class MockProjectService implements ProjectServiceFactory {
    getProject(user_id: string, project_id: string): Promise<ProjectModel> {
        return new Promise<ProjectModel>((resolve, reject) => {
            const project = {
                user_id: user_id,
            } as ProjectModel;
            resolve(project);
        });
    }
    createProject(user_id: string, title: string, description: string, editable_file: string, non_editable_file: string): Promise<ProjectModel> {
        return new Promise<ProjectModel>((resolve, reject) => {
            const project = {
                user_id: user_id,
                title: title,
                description: description,
                editable_file: editable_file,
                non_editable_file: non_editable_file,
            } as ProjectModel;
            resolve(project);
        });
    }
    updateProject(user_id: string, project: ProjectModel): Promise<ProjectModel> {
        return new Promise<ProjectModel>((resolve, reject) => {
            resolve(project);
        });
    }
    deleteProject(user_id: string, project_id: string): Promise<ProjectModel> {
        return new Promise<ProjectModel>((resolve, reject) => {
            const project = {
                user_id: user_id,
            } as ProjectModel;
            resolve(project);
        });
    }
}

describe('ProjectController', () => {
    const app = express();
    const mockProjectService = new MockProjectService();
    const mockControllerTemplate = new MockControllerTemplate();
    const projectControllers = new ProjectController(mockProjectService, mockControllerTemplate);
    const router = projectControllers.registerRouter();
    app.use(express.json())
    app.use(router.path, router.router)
    it("Update", async () => {
        const projectModel = {
            _id: randomstring.generate(),
            title: randomstring.generate(),
            description: randomstring.generate(),
            editable_file: randomstring.generate(),
            non_editable_file: randomstring.generate(),
            user_id: randomstring.generate(),
            status: 'USER',
            deployment_link: randomstring.generate(),
            last_edited: new Date(),
        }
        const body = {
            projectModel: projectModel
        }
        const {last_edited, ...objectWithoutDate} = projectModel
        const last_edited_string = last_edited.toISOString();
        const expectedProject = {
            last_edited: last_edited_string,
            ...objectWithoutDate
        }
        const called = jest.spyOn(mockProjectService, "updateProject")
        await request(app).put("/project/").send(body).expect(200)
        expect(called).toBeCalledTimes(1)
        expect(called).toBeCalledWith(mockUserId, expectedProject)
    })
})