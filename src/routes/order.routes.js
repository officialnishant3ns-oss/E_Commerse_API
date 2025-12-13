import { Router } from "express"
import verifyJWT from "../middleware/auth.middleware.js"
import { placeOrderCOD,  placeOrderStripe,placeOrderRazorpay,getallOrders, updateOrderStatus, getMyOrders} from "../controllers/order.controllers.js"
import adminAuth from "../middleware/Admin.middleware.js"
const router = Router()

//user routes
router.route("/placeordercod").post(verifyJWT, placeOrderCOD)
router.route("/placeorderstripe").post(verifyJWT, placeOrderStripe)
router.route("/placeorderrazorpay").post(verifyJWT, placeOrderRazorpay)
router.route("/getmyorders").get(verifyJWT, getMyOrders)

//admin routes
router.route("/getallorders").get(verifyJWT, adminAuth, getallOrders)
router.route("/updateorderstatus/:OrderId").put(verifyJWT, adminAuth, updateOrderStatus)

export default router