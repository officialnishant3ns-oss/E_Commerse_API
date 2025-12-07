import express from "express"
const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from "./routes/user.routes.js"
app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
app.use("/api/v1/user", userRoutes)

export default app