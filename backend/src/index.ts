import dotenv from "dotenv";
import express from "express";
import {Environment, validateEnvVar} from "./env";
import {globalRouterContainer} from "./controllers/router_container";
import logger from "./logger";
import {MongoClient} from "mongodb"

dotenv.config();

const main = async () => {
    //validateEnvVar();
    const client = new MongoClient(Environment.MONGODB_URI);
    await client.connect();
    const app = express();
    app.use(express.json());
    globalRouterContainer.registerAllRoutes(app)
    app.listen(Environment.PORT, () => {
        logger.info(`Server is running on port ${Environment.PORT}`);
    })
}

main()