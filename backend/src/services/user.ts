import {User, UserModel} from "../schema/user";
import {UserServiceFactory} from "../factories/user";
import {ProjectModel} from "../schema/project";
import {BadRequestError} from "../errors/errors";

export class UserService implements UserServiceFactory {
    async saveUser(name: string, email: string, clerk_user_id: string): Promise<UserModel> {
        const alreadyUser = await User.findOne({
            clerk_user_id: clerk_user_id,
        })
        if (alreadyUser) {
            return alreadyUser;
        }
        let user = new User({
            name: name,
            email: email,
            clerk_user_id: clerk_user_id,
        })
        user = await user.save();
        return user
    }
    async getProjects(user_id: string): Promise<ProjectModel[]> {
        const user = await User.findById(user_id).populate({
            path: "projects",
            select:
        });
        if (!user) {
            throw new BadRequestError('User not found');
        }
        return user.projects
    }
}