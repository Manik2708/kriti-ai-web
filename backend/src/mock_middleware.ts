import express from "express";

export const mockMiddleware = (req: express.Request, id: string) => {
    req.id = id
}