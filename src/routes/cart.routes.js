import { Router } from "express"
import verifyJWT from "../middleware/auth.middleware.js"
import { addToCart ,getMyCartItems} from "../controllers/cart.controllers.js"
const router = Router()

// Cart Routes
router.route("/addtocart").post(verifyJWT, addToCart)
router.route("/mycart").get(verifyJWT, getMyCartItems)


export default router