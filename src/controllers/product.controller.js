import Product from "../models/product.models.js"
import AsyncHandler from "../utils/asynchandler.js"
import ApiError from "../utils/apierror.js"
import ApiResponse from "../utils/apiresponse.js"

const createProduct = AsyncHandler(async (req, res) => {
    const { productname, description, price, stock, category } = req.body
    if (!productname || !description || !price || !category) {
        throw new ApiError(400, "Please enter required fields [ productname, description, price, stock, category]")
    }
    const productimage = req.file?.path
    if (!productimage) {
        throw new ApiError(400, "Product image is required")
    }   
   //cloudinary image upload  TODO

    const product = await Product.create({
        productname,
        description,
        productimage:productimage.secure_url,
        price,
        stock,
        category
    })

    return res.status(201).json(
        new ApiResponse(200, product, "Product created successfully")
    )
})  
export { createProduct }
