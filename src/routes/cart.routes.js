import { Router } from "express"
import verifyJWT from "../middleware/auth.middleware.js"
import { addToCart ,getMyCartItems,removeFromCart,updateCartItemQuantity,clearCart} from "../controllers/cart.controllers.js"
const router = Router()

// Cart Routes
router.route("/addtocart").post(verifyJWT, addToCart)
router.route("/getcart").get(verifyJWT, getMyCartItems)
router.route("/updatecartitemquantity").put(verifyJWT, updateCartItemQuantity)
router.route("/removefromcart/:productId").delete(verifyJWT, removeFromCart)
router.route("/clearcart").delete(verifyJWT, clearCart)

export default router