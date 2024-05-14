import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

dotenv.config()

export async function connectDB() {
    try {
        let url = process.env.DB_URL
        await mongoose.connect(url).then(() => console.log(`MongoDB connected`))
    } catch (error) {
        throw new Error(error)
    }
}