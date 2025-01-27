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
dotenv.config();

const main = async () => {
    validateEnvVar();
    await mongoose.connect(Environment.MONGODB_URI);
    const app = express();
    app.use(express.json());
    app.use(bodyParser.json({ limit: "10mb" }));
    app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
    app.use(cors())
    healthCheck(app)
    const client = new Anthropic({
        apiKey: Environment.API_KEY,
    });
    const globalRouterContainer = new GlobalRouterRegister(new ControllerTemplate(), client)
    globalRouterContainer.registerAllRoutes(app)
    app.listen(Environment.PORT, () => {
        logger.info(`Server is running on port ${Environment.PORT}`);
    })
}

const healthCheck = (app: express.Application) => {
    app.use("/", (req, res) => {
        res.status(200).send("OK");
    })
}

main()