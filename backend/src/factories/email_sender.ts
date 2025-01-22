export interface EmailSenderFactory {
    sendEmail(email: string, subject: string, text: string): void;
}