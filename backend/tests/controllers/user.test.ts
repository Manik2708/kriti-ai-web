import {describe, expect} from '@jest/globals';
import express from "express";
import {UserController} from "../../src/controllers/user";
import {UserServiceFactory} from "../../src/factories/user";
import {UserModel} from "../../src/schema/user";
import {mockClerkId, MockControllerTemplate, mockUserId} from "../helpers/mock_controller_template";
import request from "supertest"
import {ProjectModel} from "../../src/schema/project";

class MockUserService implements UserServiceFactory {
    saveUser = (name: string, email: string, clerk_user_id: string): Promise<UserModel> => {
        return new Promise<UserModel>((resolve, reject) => {
            const user: UserModel = {
                name: name,
                email: email,
                clerk_user_id: clerk_user_id,
            } as UserModel;
            resolve(user);
        })
    }
    getProjects = (user_id: string): Promise<ProjectModel[]> => {
        return new Promise<ProjectModel[]>((resolve, reject) => {
            const projects: ProjectModel[] = []
            resolve(projects)
        })
    }
}

describe("user controllers", () => {
    const app = express();
    const mockUserService = new MockUserService();
    const mockControllerTemplate = new MockControllerTemplate();
    const userControllers = new UserController(mockUserService, mockControllerTemplate)
    const router = userControllers.registerRouter()
    app.use(express.json())
    app.use(router.path, router.router)
    it("saveUser", async () => {
        const body = {
            email: "test@test.com",
            name: "test",
            clerk_user_id: mockClerkId,
        }
        const called = jest.spyOn(mockUserService, "saveUser")
        await request(app).post("/user/").send(body)
        expect(called).toBeCalledWith(body.name, body.email, mockClerkId)
    })
    it("getProjects", async () => {
        const called = jest.spyOn(mockUserService, "getProjects")
        await request(app).get("/user/projects")
        expect(called).toBeCalledWith(mockUserId)
    })
})