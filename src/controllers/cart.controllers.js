import AsyncHandler from "../utils/asynchandler.js"
import ApiError from "../utils/apierror.js"
import ApiResponse from "../utils/apiresponse.js"
import Cart from "../models/cart.models.js"
import Product from "../models/product.models.js"

//add to cart - user >>>DONE
//get my cart items - user>>>DONE
//remove from cart - user   
//update cart item quantity - user
//total cart value - user
const addToCart = AsyncHandler(async (req, res) => {
    const userId = req.user._id
    const { productId, quantity } = req.body
    if (!productId || !quantity) {
        throw new ApiError(400, "Please provide productId and quantity")
    }
    const product = await Product.findById(productId).select("_id price stock")
    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity }]
        })
    } else {
        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        )
        if (existingItem) existingItem.quantity += quantity
        else cart.items.push({ product: productId, quantity })
        await cart.save()
    }
    const cartWithProducts = await cart
        .populate("items.product", "-__v -createdAt -updatedAt")


    return res.status(200).json(
        new ApiResponse(200, cartWithProducts, "Product added to cart successfully")
    )
}
)
const getMyCartItems = AsyncHandler(async (req, res) => {
    const userId = req.user._id
    let cart = await Cart.findOne({ user: userId }).populate("items.product", "-__v -createdAt -updatedAt")

    if (!cart) {
        return res.status(200).json(
            new ApiResponse(200, [], "Cart is empty")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, cart, "Cart retrieved successfully")
    )
})



export { addToCart, getMyCartItems }