import { Router } from "express"
const router = Router()
import verifyJWT from "../middleware/auth.middleware.js"
import {createProduct} from "../controllers/product.controller.js"


router.route("/createproduct").post(verifyJWT, createProduct)

export default router