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
        object = getBadRequestErrorObject(err)
    }else if (err instanceof UnauthorizedError) {
        object = {
            statusCode: 401,
            message: "Unauthorized!",
            error: err.message,
        }
    }else{
        object = getInternalServerErrorObject(err)
    }
    const {statusCode, ...message} = object;
    return res.status(statusCode).json(message);
}

export const getBadRequestErrorObject = (error: Error): ErrorObject => {
    return {
        statusCode: 400,
        error: error.message,
        message: "Bad Request",
    }
}

export const getInternalServerErrorObject = (error: Error): ErrorObject => {
    return {
        statusCode: 500,
        error: error.message,
        message: "Internal Server Error",
    }
}

interface ErrorObject {
    statusCode: number
    message: string
    error: string
}