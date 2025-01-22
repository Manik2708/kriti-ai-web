import {describe, expect, beforeAll, afterAll,} from '@jest/globals';
import mongoose from "mongoose";
import {createMongoInstance, disconnect} from "../helpers/db_instance";
import {UserService} from "../../src/services/user";
import randomstring from 'randomstring'
import {User} from "../../src/schema/user";
import {Authentication} from "../../src/schema/authenticate";
import bcrypt from "bcrypt";

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
            password: randomstring.generate(),
        }
        const user = await userService.signUp(sendingUser.name, sendingUser.password, sendingUser.email)
        expect(user.email).toBe(sendingUser.email);
        expect(user.name).toBe(sendingUser.name);
        expect(user.projects.length).toBe(0);
        const userFromDb = await User.findById(user._id)
        expect(userFromDb == null).toBeFalsy();
        expect(userFromDb!.name).toBe(sendingUser.name);
        expect(userFromDb!.email).toBe(sendingUser.email);
        expect(userFromDb!.projects.length).toBe(0);
        const auth = await Authentication.findOne({email: sendingUser.email})
        expect(auth).toBeDefined();
        expect(auth!.user_id.toString()).toBe(String(user._id));
        expect(auth!.email).toBe(sendingUser.email);
        const encryptedPassword = auth!.password
        const matched = await bcrypt.compare(sendingUser.password, encryptedPassword);
        expect(matched).toBeTruthy();
    })
    it("should be able to login", async () => {
        const sendingUser = {
            name: randomstring.generate(),
            email: randomstring.generate(),
            password: randomstring.generate(),
        }
        await userService.signUp(sendingUser.name, sendingUser.password, sendingUser.email)
        const login = await userService.login(sendingUser.email, sendingUser.password)
        expect(login).toBeDefined();
        expect(login!.email).toBe(sendingUser.email);
        expect(login!.name).toBe(sendingUser.name);
        expect(login!.projects.length).toBe(0);
    })
    afterAll(async () => {
        await disconnect(mongooseInstance);
    })
})