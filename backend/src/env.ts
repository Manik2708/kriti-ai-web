import dotenv from "dotenv";

dotenv.config();

export class Environment {
    static JSON_SECRET_KEY: string = process.env.JSON_SECRET_KEY!;
    static API_KEY: string = process.env.API_KEY!;
    static NODEMAILER_SERVICE = process.env.NODEMAILER_SERVICE!;
    static NODEMAILER_SENDER_EMAIL = process.env.NODEMAILER_SENDER_EMAIL!;
    static NODEMAILER_SENDER_PASSWORD = process.env.NODEMAILER_SENDER_PASSWORD!;
    static PORT = process.env.PORT == null ? '3000' : process.env.PORT;
}

export const validateEnvVar = () => {
    if (!process.env.JSON_SECRET_KEY) {
        throw Error("No JSON Secret key provided");
    }
    if (!process.env.API_KEY) {
        throw Error("No CLAUD_API_KEY provided");
    }
    if (!process.env.NODEMAILER_SERVICE) {
        throw Error("No NodeMAILER_SERVICE provided");
    }
    if (!process.env.NODEMAILER_SENDER_EMAIL) {
        throw Error("No NodeMAILER_SENDER_EMAIL provided");
    }
    if (!process.env.NODEMAILER_SENDER_PASSWORD) {
        throw Error("No NodeMAILER_SENDER_PASSWORD provided");
    }
}