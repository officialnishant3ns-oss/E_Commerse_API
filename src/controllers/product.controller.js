import Product from "../models/product.models.js"
import AsyncHandler from "../utils/asynchandler.js"
import ApiError from "../utils/apierror.js"
import ApiResponse from "../utils/apiresponse.js"

const createProduct = AsyncHandler(async (req, res) => {
    const { productname, description, price, stock, category, subcategory, sizes } = req.body
   console.log("Request Body:", req.body)
    if (!productname || !price || !category || !description || !stock) {
        throw new ApiError(400, "Please enter required fields [productname, description, price, stock, category]")
    }

    const productimage1 = req.files?.productimage1?.[0]
    const productimage2 = req.files?.productimage2?.[0]
    const productimage3 = req.files?.productimage3?.[0]
    const productimage4 = req.files?.productimage4?.[0]

    if (!productimage1 && !productimage2 && !productimage3 && !productimage4) {
        throw new ApiError(400, "Product image is required")
    }

    const product = await Product.create({
        productname,
        description,
        productimage1: productimage1?.path,
        productimage2: productimage2?.path,
        productimage3: productimage3?.path,
        productimage4: productimage4?.path,
        price,
        stock,
        category,
        subcategory,
        sizes,
        owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(200, product, "Product created successfully")
    )
})

export { createProduct }
