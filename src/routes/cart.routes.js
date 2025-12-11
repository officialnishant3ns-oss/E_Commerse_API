import { Router } from "express"
import verifyJWT from "../middleware/auth.middleware.js"
import { addToCart } from "../controllers/cart.controllers.js"
const router = Router()

// Cart Routes
router.route("/addtocart").post(verifyJWT, addToCart)

export default router