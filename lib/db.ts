import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
    throw new Error("Please define mongodb url in env")
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

export async function connectToDb() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        mongoose
        .connect(MONGODB_URL)
        .then(() => mongoose.connection)
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error
    }

    return cached.conn;
}