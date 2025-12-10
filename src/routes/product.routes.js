import { Router } from "express"
const router = Router()
import verifyJWT from "../middleware/auth.middleware.js"
import {createProduct, getListOfallProducts,getListOfProductsBySearchFilter} from "../controllers/product.controller.js"
import upload from "../middleware/multer.middleware.js"
import { get } from "mongoose"


// Product Routes
router.route("/createproduct").post(verifyJWT, upload.fields([{ name: 'productimages', maxCount: 5 }]), createProduct)
router.route("/getproducts").get(verifyJWT,getListOfallProducts)
router.route("/searchproducts").get(getListOfProductsBySearchFilter)



export default router