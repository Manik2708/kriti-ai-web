import {UserService} from "../../src/services/user";
import {UserModel} from "../../src/schema/user";
import randomstring from "randomstring";

export const createUser = async (): Promise<UserModel> => {
    const userService = new UserService();
    return userService.saveUser(
        randomstring.generate(),
        randomstring.generate(),
        randomstring.generate()
    )
}