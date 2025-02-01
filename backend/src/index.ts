import dotenv from "dotenv";
import express from "express";
import {Environment, validateEnvVar} from "./env";
import {GlobalRouterRegister} from "./controllers/router_container";
import logger from "./logger";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import Anthropic from "@anthropic-ai/sdk";
import cors from "cors";
import {ControllerTemplate} from "./controllers/controller_template";
import {Octokit} from "@octokit/core";
import {PubSub} from "./services/pubsub";
import EventEmitter from "events";
import {HostingServices} from "./services/hosting";
dotenv.config();

const main = async () => {
    validateEnvVar();
    await mongoose.connect(Environment.MONGODB_URI);
    const app = express();
    app.use(express.json({
        limit: "10mb"
    }));
    app.use(bodyParser.json({ limit: "10mb" }));
    app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
    app.use(cors())
    const client = new Anthropic({
        apiKey: Environment.API_KEY,
    });
    const emitter = new EventEmitter()
    const octokit = new Octokit({
        auth: Environment.GITHUB_TOKEN
    })
    const hosting = new HostingServices(octokit);
    const pubsub = new PubSub(emitter, hosting);
    pubsub.init()
    const globalRouterContainer = new GlobalRouterRegister(new ControllerTemplate(), client, pubsub)
    globalRouterContainer.registerAllRoutes(app)
    app.listen(Environment.PORT, () => {
        logger.info(`Server is running on port ${Environment.PORT}`);
    })
}
main()
