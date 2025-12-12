import { Router } from "express"
import verifyJWT from "../middleware/auth.middleware.js"
import {} from "../controllers/order.controllers.js"
import adminAuth from "../middleware/Admin.middleware.js"
const router = Router()



export default router