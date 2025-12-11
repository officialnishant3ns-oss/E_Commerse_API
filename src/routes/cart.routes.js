import { Router } from "express"
import verifyJWT from "../middleware/auth.middleware.js"
import { addToCart ,getMyCartItems,removeFromCart,updateCartItemQuantity} from "../controllers/cart.controllers.js"
const router = Router()

// Cart Routes
router.route("/addtocart").post(verifyJWT, addToCart)
router.route("/mycart").get(verifyJWT, getMyCartItems)
router.route("/removefromcart/:productId").delete(verifyJWT, removeFromCart)
router.route("/updatecartitemquantity").put(verifyJWT, updateCartItemQuantity)


export default router