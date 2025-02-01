import dotenv from "dotenv";

dotenv.config();

export class Environment {
    static API_KEY: string = process.env.API_KEY!;
    static PORT = process.env.PORT == null ? '3000' : process.env.PORT;
    static MONGODB_URI = process.env.MONGODB_URI!;
    static GITHUB_EMAIL = process.env.GITHUB_EMAIL!;
    static GITHUB_NAME = process.env.GITHUB_NAME!;
    static GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
}

export const validateEnvVar = () => {
    if (!process.env.API_KEY) {
        throw Error("No CLAUD_API_KEY provided");
    }
    if (!process.env.MONGODB_URI) {
        throw Error("No MongoDB URI provided");
    }
    if (!process.env.CLERK_PUBLISHABLE_KEY) {
        throw Error("No CLERK_PUBLISHABLE_KEY provided");
    }
    if (!process.env.CLERK_SECRET_KEY) {
        throw Error("No CLERK_SECRET_KEY provided");
    }
    if (!process.env.GITHUB_EMAIL) {
        throw Error("No GITHUB_EMAIL provided");
    }
    if (!process.env.GITHUB_NAME) {
        throw Error("No GITHUB_NAME provided");
    }
    if (!process.env.GITHUB_TOKEN) {
        throw Error("No GITHUB_TOKEN provided");
    }
}