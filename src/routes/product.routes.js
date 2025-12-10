import { Router } from "express"
const router = Router()
import verifyJWT from "../middleware/auth.middleware.js"
import {createProduct, getListOfallProducts,getListOfProductsBySearchFilter,deleteproduct} from "../controllers/product.controller.js"
import upload from "../middleware/multer.middleware.js"

// Product Routes
router.route("/createproduct").post(verifyJWT, upload.fields([{ name: 'productimages', maxCount: 5 }]), createProduct)
router.route("/getproducts").get(verifyJWT,getListOfallProducts)
router.route("/searchproducts").get(getListOfProductsBySearchFilter)
router.route('/deleteproduct/:ProductId').delete(verifyJWT, deleteproduct)


export default router