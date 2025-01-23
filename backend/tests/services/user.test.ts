import {describe, expect, beforeAll, afterAll,} from '@jest/globals';
import mongoose from "mongoose";
import {createMongoInstance, disconnect} from "../helpers/db_instance";
import {UserService} from "../../src/services/user";
import randomstring from 'randomstring'
import {User} from "../../src/schema/user";

describe("User Services tests", () => {
    let mongooseInstance: typeof mongoose;
    let userService: UserService;
    beforeAll(async () => {
        mongooseInstance = await createMongoInstance();
        userService = new UserService();
    })
    it("should be able to create the user", async () => {
        const sendingUser = {
            name: randomstring.generate(),
            email: randomstring.generate(),
            clerk_user_id: randomstring.generate(),
        }
        const user = await userService.saveUser(sendingUser.name, sendingUser.email, sendingUser.clerk_user_id);
        expect(user.email).toBe(sendingUser.email);
        expect(user.name).toBe(sendingUser.name);
        expect(user.clerk_user_id).toBe(sendingUser.clerk_user_id);
        expect(user.projects.length).toBe(0);
        const userFromDb = await User.findById(user._id)
        expect(userFromDb == null).toBeFalsy();
        expect(userFromDb!.name).toBe(sendingUser.name);
        expect(userFromDb!.email).toBe(sendingUser.email);
        expect(userFromDb!.clerk_user_id).toBe(sendingUser.clerk_user_id);
        expect(userFromDb!.projects.length).toBe(0);
    })
    afterAll(async () => {
        await disconnect(mongooseInstance);
    })
})