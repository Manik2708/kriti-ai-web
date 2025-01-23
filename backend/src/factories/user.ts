import {UserModel} from "../schema/user";
import {ProjectModel} from "../schema/project";

export interface UserServiceFactory {
    saveUser(name: string, email: string, clerk_user_id: string): Promise<UserModel>
    getProjects(user_id: string): Promise<ProjectModel[]>
}