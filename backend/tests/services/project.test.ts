import {describe, expect, beforeAll, afterAll,} from '@jest/globals';
import mongoose from "mongoose";
import {createMongoInstance, disconnect} from "../helpers/db_instance";
import {ProjectService} from "../../src/services/project";
import {createUser} from "../helpers/create_new_user";
import randomstring from "randomstring";
import {MessageService} from "../../src/services/message";

describe('ProjectService', () => {
    let mongooseInstance: typeof mongoose;
    let projectService: ProjectService;
    let messageService: MessageService
    beforeAll(async () => {
        mongooseInstance = await createMongoInstance();
        projectService = new ProjectService();
        messageService = new MessageService();
    })
    it("Get", async ()=> {
        const user = await createUser()
        const project = await projectService.createProject(user._id.toString(), randomstring.generate(), randomstring.generate())
        await messageService.create(user._id.toString(), project._id.toString(), randomstring.generate(), randomstring.generate(), 'USER')
        const gotProject = await projectService.getProject(user._id.toString(), project._id.toString())
        expect(gotProject._id).toEqual(project._id);
    })
    afterAll(async () => {
        await disconnect(mongooseInstance);
    })
})