import {User, UserModel} from "../schema/user";
import {Authentication} from "../schema/authenticate";
import {BadRequestError, InternalServerError} from "../errors/errors";
import {LoginResponse} from "../models/login";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Environment} from "../env";

export interface UserServiceTemplate {
    signUp(name: string, password: string, email: string): Promise<UserModel>
    login(email: string, password: string): Promise<LoginResponse>
}

export class UserService implements UserServiceTemplate {
    async signUp(name: string, password: string, email: string): Promise<UserModel> {
        const alreadyExists = await Authentication.findOne({ email: email });
        if (alreadyExists) {
            throw new BadRequestError("User already exists");
        }
        let user = new User({
            name: name,
            email: email,
        })
        user = await user.save();
        const encryptedPassword = await bcrypt.hash(password, 12);
        const authentication = new Authentication({
            email: email,
            password: encryptedPassword,
            user_id: user._id,
        });
        authentication.save();
        return user
    }
    async login(email: string, password: string): Promise<LoginResponse> {
        const authentication = await Authentication.findOne({email: email});
        if (!authentication) {
            throw new BadRequestError("No user found with this email");
        }
        const passwordFromDb = authentication.password;
        if (!passwordFromDb) {
            throw new InternalServerError("Password not found in authentication");
        }
        const matched = await bcrypt.compare(password, passwordFromDb);
        if (!matched) {
            throw new BadRequestError("Wrong email or password");
        }
        const usr = await User.findById(authentication.user_id)
        if (!usr) {
            throw new BadRequestError("User not found");
        }
        const token = jwt.sign({ id: usr._id }, Environment.JSON_SECRET_KEY, {})
        return {token: token, ...usr._doc}
    }
}