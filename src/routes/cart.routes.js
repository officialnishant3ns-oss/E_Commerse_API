import { Router } from "express"
import verifyJWT from "../middleware/auth.middleware.js"
import { addToCart} from "../controllers/cart.controller.js"
const router = Router()



export default router