import {ControllerRegister, RouterRegistrar} from "./controller_register";
import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import {basePrompt} from "../prompts/base_prompt";
import {handleError} from "../errors/error_handler";
import {rePrompting} from "../prompts/reprompting";
import {ControllerTemplateFactory} from "../factories/controller_factory";
import {RequestMethodTypes} from "./controller_template";
import {InternalServerError} from "../errors/errors";
import {MessageStream} from "@anthropic-ai/sdk/lib/MessageStream";

export class PromptController implements ControllerRegister {
    constructor(private readonly client: Anthropic, private readonly object: ControllerTemplateFactory) {}
    registerRouter(): RouterRegistrar {
        const router = express.Router();
        this.object.addControllerWithAuthMiddleware(router, '/send', RequestMethodTypes.POST, this.send)
        this.object.addControllerWithAuthMiddleware(router, '/reprompt', RequestMethodTypes.POST, this.reprompt)
        return {
            router: router,
            path: '/prompt'
        }
    }
    private send = async (req: express.Request, res: express.Response) => {
        try {
            const { prompt } = req.body;
            const stream = this.client.messages.stream({
                max_tokens: 8000,
                messages: [{ role: 'user', content: basePrompt }, { role: 'user', content: prompt }],
                model: 'claude-3-5-sonnet-latest',
                stream: true
            });
            this.makeResReady(res)
            this.handleStream(stream, res)
        }catch (e) {
            handleError(e, res)
        }
    }
    private reprompt = async (req: express.Request, res: express.Response) => {
      try {
          const { file, prompt } = req.body;
          const stream = this.client.messages.stream({
              max_tokens: 8000,
              messages: [{ role: 'user', content: rePrompting }, { role: 'user', content: file }, { role: 'user', content: prompt }],
              model: 'claude-3-5-sonnet-latest',
              stream: true
          })
          this.makeResReady(res)
          this.handleStream(stream, res)
      }catch (e) {
          handleError(e, res)
      }
    }
    private makeResReady = (res: express.Response) => {
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
    }
    private handleStream = (stream: MessageStream, res: express.Response) => {
        stream.on('text', (chunk) => {
            res.write(chunk);
        })
        stream.on('end', () => {
            res.end();
        })
        stream.on('error', (error) => {
            throw new InternalServerError(error.message);
        })
    }
}