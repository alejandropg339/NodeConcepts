import mongoose from 'mongoose';

export interface Options { 
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {
    static async connect(options: Options) {
        const { dbName, mongoUrl } = options;
        try {
            await mongoose.connect(mongoUrl, {
                dbName
            });
            
            return true;

        } catch (error) {
            console.log('Error connecting to the database', error);
            throw error;
        }
    }
}