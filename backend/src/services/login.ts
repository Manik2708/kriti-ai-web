import {LoginResponse} from "../models/login";
import {Authentication} from "../schema/authenticate";
import {User} from "../schema/user"
import {BadRequestError, InternalServerError} from "../errors/errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Environment} from "../env";

export class LoginServices{
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
        const usr = await User.findById(passwordFromDb.user_id)
        if (!usr) {
            throw new BadRequestError("User not found");
        }
        const token = jwt.sign({ id: usr._id }, Environment.JSON_SECRET_KEY, {})
        return {token: token, ...usr._doc}
    }
}