import express from "express";
import {BadRequestError, UnauthorizedError} from "./errors";

export const handleError = (err: unknown, res: express.Response) => {
    if (!(err instanceof Error)) {
       return res.status(500).send({
           message: "Unknown error",
       })
    }
    let object: ErrorObject
    if (err instanceof BadRequestError) {
        object = {
            statusCode: 400,
            message: "Bad Request!",
            error: err.message,
        }
    }else if (err instanceof UnauthorizedError) {
        object = {
            statusCode: 401,
            message: "Unauthorized!",
            error: err.message,
        }
    }else {
        object = {
            statusCode: 500,
            message: "Internal Server error",
            error: err.message,
        }
    }
    const {statusCode, ...message} = object;
    return res.status(statusCode).json(message);
}

interface ErrorObject {
    statusCode: number
    message: string
    error: string
}