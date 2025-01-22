import {UserModel} from "../schema/user";

export interface OtpServiceFactory {
    sendOtp(email: string): Promise<string>
    verifyEmail(email: string, token: string, otp: string): Promise<UserModel>
}