import express from "express";

export interface RouterRegistrar {
    router: express.Router;
    path: string
}

export interface ControllerRegister{
    registerRouter(): RouterRegistrar;
}