import dotenv from "dotenv";
import express from "express";
import {Environment, validateEnvVar} from "./env";
import {globalRouterContainer} from "./controllers/router_container";
import logger from "./logger";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {createProxyMiddleware} from "http-proxy-middleware";
dotenv.config();

const main = async () => {
    validateEnvVar();
    await mongoose.connect(Environment.MONGODB_URI);
    const app = express();
    app.use(express.json());
    app.use(bodyParser.json({ limit: "10mb" }));
    app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
    app.use(createProxyMiddleware({
        target: 'http://www.example.org',
        changeOrigin: true,
    }))
    globalRouterContainer.registerAllRoutes(app)
    app.listen(Environment.PORT, () => {
        logger.info(`Server is running on port ${Environment.PORT}`);
    })
}

main()