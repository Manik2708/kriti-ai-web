import {describe, expect, beforeAll, afterAll,} from '@jest/globals';
import mongoose from "mongoose";
import {OtpService} from "../../src/services/otp";
import {EmailSenderFactory} from "../../src/services/email_sender";
import {createMongoInstance, disconnect} from "../helpers/db_instance";
import {createUser} from "../helpers/create_new_user";
import {generateOtp, verifyOtp} from "otp-generator-ts";
import {User} from "../../src/schema/user";

class MockEmailService implements EmailSender {
    sendEmail(email: string, subject: string, text: string) {
        return {
            email: email,
            subject: subject,
            text: text,
        }
    }
}

jest.mock("otp-generator-ts", ()=>({
    generateOtp: jest.fn(),
    verifyOtp: jest.fn(),
}));

describe("Otp tests", () => {
    let mongooseInstance: typeof mongoose;
    beforeAll(async () => {
        mongooseInstance = await createMongoInstance();
    })
    it("should be able to send the otp through email sender", async () => {
        (generateOtp as jest.Mock).mockReturnValueOnce({
            otp: 1234,
            token: 'randomstring',
        })
        const mockEmailService = new MockEmailService();
        const called = jest.spyOn(mockEmailService, 'sendEmail')
        const otpService = new OtpService(mockEmailService);
        const user = await createUser()
        const otp = await otpService.sendOtp(user.email)
        expect(called).toBeCalledTimes(1)
        const subject = "Kameng AI OTP Verification"
        const text = `Thanks for showing interest in Kameng AI. Your verification OTP is: 1234. Please see that this OTP is valid for only 10 minutes`
        expect(called).toBeCalledWith(user.email, subject, text)
        expect(otp).toBe('randomstring')
        expect(generateOtp).toHaveBeenCalledWith(4, '10m', 'emailOtp');
        expect(generateOtp).toHaveBeenCalledTimes(1);
    })
    it('should verify otp', async () => {
        (verifyOtp as jest.Mock).mockReturnValueOnce(true)
        const mockEmailService = new MockEmailService();
        const otpService = new OtpService(mockEmailService);
        const user = await createUser()
        const verify = await otpService.verifyEmail(user.email, 'randomstring', '1234')
        expect(verifyOtp).toHaveBeenCalledWith(1234, 'randomstring', 'emailotp')
        expect(verify.isEmailVerified).toBe(true)
        const userFromDb = await User.findOne({email: user.email})
        expect(userFromDb!.isEmailVerified).toBe(true)
    })
    afterAll(async () => {
        await disconnect(mongooseInstance)
    })
})