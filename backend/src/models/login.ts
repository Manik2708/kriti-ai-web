import {UserModel} from "../schema/user";

export interface LoginResponse extends UserModel{
    token: string;
}