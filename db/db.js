import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const connectDB = async () => {
    try {
        await  mongoose.connect(process.env.MONGO_URL)
        console.log("db is connected successfully")
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export default connectDB