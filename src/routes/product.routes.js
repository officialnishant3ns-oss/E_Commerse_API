import { Router } from "express"
const router = Router()
import verifyJWT from "../middleware/auth.middleware.js"
import {createProduct} from "../controllers/product.controller.js"
import upload from "../middleware/multer.middleware.js"


// Product Routes
router.route("/createproduct").post(verifyJWT, upload.fields([{ name: 'productimages', maxCount: 5 }]), createProduct)
export default router