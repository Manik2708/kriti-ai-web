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
import {FirebaseServices} from "./services/firebase";
dotenv.config();

const main = async () => {
    validateEnvVar();
    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML Page</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f0f2f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        header {
            text-align: center;
            margin-bottom: 30px;
        }
        h1 {
            color: #1a73e8;
        }
        .card {
            border: 1px solid #ddd;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        button {
            background-color: #1a73e8;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #1557b0;
        }
        footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Welcome to My Website</h1>
            <p>This is a sample HTML page with some basic styling</p>
        </header>

        <main>
            <section>
                <h2>Features</h2>
                <div class="card">
                    <h3>Responsive Design</h3>
                    <p>This page adapts to different screen sizes and devices.</p>
                </div>
                <div class="card">
                    <h3>Modern Styling</h3>
                    <p>Uses modern CSS features for a clean, professional look.</p>
                </div>
            </section>

            <section>
                <h2>Interactive Elements</h2>
                <button id="clickMe">Click Me!</button>
                <p id="output"></p>
            </section>
        </main>

        <footer>
            <p>&copy; 2025 Sample Website. All rights reserved.</p>
        </footer>
    </div>

    <script>
        document.getElementById('clickMe').addEventListener('click', function() {
            document.getElementById('output').textContent = 'Button clicked at: ' + new Date().toLocaleTimeString();
        });
    </script>
</body>
</html>
    `
    const jsonStringified = JSON.stringify(html)
    const jsonParsed = JSON.parse(jsonStringified)
    const service = new FirebaseServices()
    const id = await service.createSite("sample-project")
    //const object = await service.deploy(id, jsonParsed)
    // await mongoose.connect(Environment.MONGODB_URI);
    // const app = express();
    // app.use(express.json({
    //     limit: "10mb"
    // }));
    // app.use(bodyParser.json({ limit: "10mb" }));
    // app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
    // app.use(cors())
    // const client = new Anthropic({
    //     apiKey: Environment.API_KEY,
    // });
    // const globalRouterContainer = new GlobalRouterRegister(new ControllerTemplate(), client)
    // globalRouterContainer.registerAllRoutes(app)
    // app.listen(Environment.PORT, () => {
    //     logger.info(`Server is running on port ${Environment.PORT}`);
    // })
}
main()