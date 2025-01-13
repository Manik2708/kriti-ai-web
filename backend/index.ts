import dotenv from "dotenv";
import express from "express";
import {globalRouterContainer} from "./src/controllers/router_container";
import {Environment, validateEnvVar} from "./src/env";

dotenv.config();

const main = async (): Promise<void> => {
    validateEnvVar();
    const app = express();
    app.use(express.json());
    globalRouterContainer.registerAllRoutes(app)
    app.listen(Environment.PORT, () => {
        console.log("Server is running on port", Environment.PORT);
    })
}

main()