import {User, UserModel} from "../schema/user";
import {BadRequestError} from "../errors/errors";
import {generateOtp, verifyOtp} from "otp-generator-ts";
import {OtpServiceFactory} from "../factories/otp";
import {EmailSenderFactory} from "../factories/email_sender";

export class OtpService implements OtpServiceFactory{
    constructor(private readonly emailSender: EmailSenderFactory) {}
    async sendOtp(email: string): Promise<string> {
        const user = User.findOne({
            email: email,
        })
        if (!user) {
            throw new BadRequestError("User does not exist");
        }
        const otp = generateOtp(4, '10m', 'emailOtp')
        const subject = "Kameng AI OTP Verification"
        const text = `Thanks for showing interest in Kameng AI. Your verification OTP is: ${otp.otp}. Please see that this OTP is valid for only 10 minutes`
        this.emailSender.sendEmail(email, subject, text)
        return otp.token
    }
    async verifyEmail(email: string, token: string, otp: string): Promise<UserModel> {
        const parsedOtp: number = parseInt(otp);
        if (Number.isNaN(parsedOtp)) {
            throw new BadRequestError("Invalid OTP number");
        }
        const isVerified = verifyOtp(
            parsedOtp,
            token,
            'emailotp',
        );
        if (!isVerified) {
            throw new BadRequestError("Wrong OTP");
        }
        const user = await User.findOneAndUpdate({
                email: email,
            },
            {
                isEmailVerified: true
            },
            {
                new: true
            }
        )
        if (!user) {
            throw new BadRequestError("User does not exist");
        }
        return user._doc
    }
}