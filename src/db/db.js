import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'

const connectdb = async (req, res) => {
    try {
        const conection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected Successfully:: DB_HOST: ${conection.connection.host}`)
    } catch (error) {
        console.error("Mongo_DB connection error:", error)
        process.exit(1)
    }
}

export default connectdb