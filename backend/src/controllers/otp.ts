import {ControllerRegister, RouterRegistrar} from "./controller_register";
import {OtpServiceTemplate} from "../services/otp";
import express from "express";
import {handleError} from "../errors/error_handler";
import {ControllerTemplate, RequestMethodTypes} from "./controller_template";

export class OtpController implements ControllerRegister {
    constructor(private readonly otpService: OtpServiceTemplate) {}
    private async sendOtpController(req: express.Request, res: express.Response){
        try {
            const {email} = req.body;
            const token = await this.otpService.sendOtp(email)
            return res.status(200).json({otp_token: token});
        }catch (e) {
            handleError(e, res)
        }
    }
    private async verifyEmail(req: express.Request, res: express.Response){
        try {
            const {email, otp_token, otp} = req.body;
            const user = await this.otpService.verifyEmail(email, otp_token, otp)
            return res.status(200).json(user)
        }catch(err){
            handleError(err, res)
        }
    }
    registerRouter(): RouterRegistrar {
        const router = express.Router();
        const object = new ControllerTemplate(router);
        object.addControllerWithoutMiddleware("/send-otp", RequestMethodTypes.POST, this.sendOtpController)
        object.addControllerWithoutMiddleware("/verify-email", RequestMethodTypes.POST, this.verifyEmail)
        return {
            router: router,
            path: '/otp'
        }
    }
}