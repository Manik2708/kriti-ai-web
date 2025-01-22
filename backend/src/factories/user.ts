import {UserModel} from "../schema/user";
import {LoginResponse} from "../models/login";

export interface UserServiceFactory {
    signUp(name: string, password: string, email: string): Promise<UserModel>
    login(email: string, password: string): Promise<LoginResponse>
}