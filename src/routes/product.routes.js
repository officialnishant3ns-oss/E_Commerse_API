import { Router } from "express"
const router = Router()
import verifyJWT from "../middleware/auth.middleware.js"
import adminAuth from "../middleware/Admin.middleware.js"
import {createProduct, getListOfallProducts,getListOfProductsBySearchFilter,deleteproduct,getSingleProductDetails} from "../controllers/product.controller.js"
import upload from "../middleware/multer.middleware.js"

// Product Routes
router.route("/createproduct").post(verifyJWT,adminAuth,upload.fields([{ name: 'productimages', maxCount: 5 }]), createProduct)
router.route("/getproducts").get(verifyJWT,adminAuth,getListOfallProducts)
router.route("/searchproducts").get(getListOfProductsBySearchFilter)
router.route('/deleteproduct/:ProductId').delete(verifyJWT,adminAuth, deleteproduct)
router.route('/singleproduct/:ProductId').get(verifyJWT,adminAuth, getSingleProductDetails)
export default router