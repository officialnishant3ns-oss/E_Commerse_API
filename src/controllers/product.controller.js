import Product from "../models/product.models.js"
import AsyncHandler from "../utils/asynchandler.js"
import ApiError from "../utils/apierror.js"
import ApiResponse from "../utils/apiresponse.js"
import uploadoncloudinary from "../utils/cloudinary.js"

const createProduct = AsyncHandler(async (req, res) => {
  const { productname, description, price, category, subcategory, sizes } = req.body

  if (!productname || !description || !price || !category) {
    throw new ApiError(400, "Please enter required fields [productname, description, price, category]")
  }

  if (!req.files || !req.files.productimages || req.files.productimages.length === 0) {
    throw new ApiError(400, "Product images are required")
  }

  const productimages = []
  for (const file of req.files.productimages) {
    const uploadedImage = await uploadoncloudinary(file.path, "ProductImages")
    if (uploadedImage?.secure_url) {
      productimages.push(uploadedImage.secure_url)
    }
  }

  if (productimages.length === 0) {
    throw new ApiError(400, "Failed to upload product images")
  }

  let parsedSizes = []

  if (sizes) {
    parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes

    if (!Array.isArray(parsedSizes)) {
      throw new ApiError(400, "Sizes must be an array")
    }

    parsedSizes.forEach(v => {
      if (!v.size || v.stock === undefined) {
        throw new ApiError(400, "Each size must include size and stock")
      }
      if (v.stock < 0) {
        throw new ApiError(400, "Stock cannot be negative")
      }
    })
  }

  const product = await Product.create({
    productname,
    description,
    productimages,
    price,
    category,
    subcategory: subcategory || "",
    sizes: parsedSizes,
    owner: req.user._id
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
const getListOfProductsBySearchFilter = AsyncHandler(async (req, res) => {
  const { productname, category, minprice, maxprice, sizes } = req.query

  const queryObject = {}

  if (productname) {  
    queryObject.productname = { $regex: productname, $options: "i" }
  }
  if (category) {   
    queryObject.category = category
  }
  if (minprice || maxprice) {   
    queryObject.price = {}
    if (minprice) {
      queryObject.price.$gte = Number(minprice)
    }
    if (maxprice) {
      queryObject.price.$lte = Number(maxprice)
    }
  }
  if (sizes) {   //todo: check this >> filter by sizes
    const sizesArray = sizes.split(",").map(size => size.trim())
    queryObject.sizes = { $in: sizesArray }
  }

  const products = await Product.find(queryObject).populate("owner", "username email")

  return res.status(200).json(
    new ApiResponse(200, products, "Filtered products fetched successfully")
  )
})
const deleteproduct = AsyncHandler(async (req, res) => {
  const { ProductId } = req.params

  if (!ProductId) {
    throw new ApiError(400, "ProductId is required");
  }
  const product = await Product.findByIdAndDelete(ProductId)
  if (!product) {
    throw new ApiError(400, "Product Not Found")
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Products fetched And Deleted Successfully")
  )
})
const getSingleProductDetails = AsyncHandler(async (req, res) => {
  const { ProductId } = req.params

  if (!ProductId) {
    throw new ApiError(400, "ProductId is required");
  }
  const product = await Product.findById(ProductId).populate("owner", "username email")
  if (!product) {
    throw new ApiError(400, "Product Not Found")
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Products fetched Successfully")
  )
})
const updateProduct = AsyncHandler(async (req, res) => {
  // TODISO: Implement update product functionality
  const { ProductId } = req.params
  if (!ProductId) {
    throw new ApiError(400, "ProductId is required");
  }
  const product = await Product.findByIdandUpdate(ProductId, req.body, { new: true })
  if (!product) {
    throw new ApiError(400, "Product Not Found")
  }
  return res.status(200).json(
    new ApiResponse(200, product, "Products Updated Successfully")
  )
})


export { createProduct, getListOfallProducts, getListOfProductsBySearchFilter, deleteproduct, updateProduct, getSingleProductDetails }