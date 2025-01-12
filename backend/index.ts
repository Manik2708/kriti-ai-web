import dotenv from "dotenv";
import {Environment, validateEnvVar} from "./src/env";
import Anthropic from "@anthropic-ai/sdk";
import {basePrompt} from "./src/prompts/base_prompt";
import { GoogleGenerativeAI } from "@google/generative-ai"
dotenv.config();

const main = async (): Promise<void> => {
    validateEnvVar()
    // const client = new Anthropic()
    // const stream = client.messages.stream({
    //     max_tokens: 8000,
    //     messages: [
    //         {
    //             role: 'user',
    //             content: basePrompt
    //         },
    //         {
    //            role: 'user',
    //            content: 'make a todo app'
    //         },
    //     ],
    //     model: 'claude-3-5-sonnet-latest'
    // })
    // stream.on('message', (message) => {
    //     console.log(message)
    // })
    const genAI = new GoogleGenerativeAI(Environment.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    model.generateContentStream({
        contents: [{
            role: 'user',
            parts: [
                basePrompt,
            ]
        }]
    })
}

main()