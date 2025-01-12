import express from "express";
import {BadRequestError, UnauthorizedError} from "../errors/errors";
import jwt from "jsonwebtoken";
import {User} from "../schema/user";
import {Environment} from "../env";
import {handleError} from "../errors/error_handler";

export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        req.id = await authenticate(req.header("token"));
        return next();
    }catch (e) {
        handleError(e, res)
    }
}

const authenticate = async (header: any): Promise<string> => {
    const token: any = header;
    if (token == null || token.toString().trim().length == 0) {
        throw new UnauthorizedError("No token provided");
    }
    if (token.toString().includes(' ')) {
        throw new UnauthorizedError("Invalid token provided");
    }
    const decode = jwt.verify(token, Environment.JSON_SECRET_KEY);
    const id = (decode as jwt.JwtPayload).id;
    if (!id) throw new UnauthorizedError("Invalid token provided");
    const user = await User.findById(id);
    if (!user) {
        throw new BadRequestError("User does not exist");
    }
    return id;
}