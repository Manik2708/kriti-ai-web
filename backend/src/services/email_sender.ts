import sendmail from "nodemailer";
import {Environment} from "../env";
import {InternalServerError} from "../errors/errors";

export interface EmailSender {
    sendEmail(email: string, subject: string, text: string): void;
}

export class EmailSenderService implements EmailSender {
    sendEmail(email: string, subject: string, text: string): void {
        const transporter = sendmail.createTransport({
            service: Environment.NODEMAILER_SERVICE,
            auth: {
                user: Environment.NODEMAILER_SENDER_EMAIL,
                pass: Environment.NODEMAILER_SENDER_PASSWORD,
            },
        });
        transporter.sendMail({
                to: email,
                subject: subject,
                text: text,
            },
            (error) => {
                if (error) {
                    throw new InternalServerError(error.message);
                }
            }
        )
    }
}