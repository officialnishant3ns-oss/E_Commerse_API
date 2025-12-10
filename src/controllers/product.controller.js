import Product from "../models/product.models.js"
import AsyncHandler from "../utils/asynchandler.js"
import ApiError from "../utils/apierror.js"
import ApiResponse from "../utils/apiresponse.js"
import uploadoncloudinary from "../utils/cloudinary.js"

const createProduct = AsyncHandler(async (req, res) => {
  const { productname, description, price, stock, category, subcategory, sizes } = req.body
  if (!productname || !description || !price || !category) {
    throw new ApiError(400, "Please enter required fields [productname, description, price, category]")
  }
  if (!req.files || !req.files.productimages || req.files.productimages.length === 0) {
    throw new ApiError(400, "Product images are required")
  }
  const productimages = []
  for (const file of req.files.productimages) {

    const uploadedImage = await uploadoncloudinary(file.path, "ProductImages");
    if (uploadedImage?.secure_url) {
      productimages.push(uploadedImage.secure_url)
    }
  }

  if (productimages.length === 0) {
    throw new ApiError(400, "Failed to upload product images");
  }


  const product = await Product.create({
    productname,
    description,
    productimages,
    price,
    stock: stock || 0,
    category,
    subcategory: subcategory || "",
    sizes: sizes || [],
    owner: req.user._id,
  })

  return res.status(201).json(
    new ApiResponse(201, product, "Product created successfully")
  )
})
const getListOfallProducts = AsyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("owner", "username email")

  return res.status(200).json(
    new ApiResponse(200, products, "List of products fetched successfully")
  )
})






export { createProduct, getListOfallProducts }