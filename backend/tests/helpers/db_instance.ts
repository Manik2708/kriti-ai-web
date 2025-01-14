import mongoose from 'mongoose';

export async function createMongoInstance(): Promise<typeof mongoose> {
    const dbName: string = 'KAMENG_KRITI_TEST_DATABASE';
    return mongoose.connect('mongodb://localhost:27018', {
        dbName,
    });
}

export async function disconnect(
    mongooseInstance: typeof mongoose,
): Promise<void> {
    await mongooseInstance.connection.close();
}