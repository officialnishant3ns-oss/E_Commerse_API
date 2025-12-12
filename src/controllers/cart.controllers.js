import AsyncHandler from "../utils/asynchandler.js"
import ApiError from "../utils/apierror.js"
import ApiResponse from "../utils/apiresponse.js"
import Cart from "../models/cart.models.js"
import Product from "../models/product.models.js"

//add to cart - user                    >>>DONE
//get my cart items - user              >>>DONE
//update cart item quantity - user      >>>DONE
//remove from cart - user                  >>IN PROGRESS
// cart clear - user    

const addToCart = AsyncHandler(async (req, res) => {
    const userId = req.user._id
    const { productId, quantity, size } = req.body
    if (!productId || !quantity || quantity < 1 || !size) {
        throw new ApiError(400, "productId and valid quantity are required");
    }
    const product = await Product.findById(productId).select("_id price sizes")
    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    const selectedVariant = product.sizes.find(v => v.size === size)
    if (!selectedVariant) {
        throw new ApiError(400, `Size ${size} is not available for this product`)
    }
    if (quantity > selectedVariant.stock) {
        throw new ApiError(400, `Only ${selectedVariant.stock} items available for size ${size}`)
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity: quantity, size: size }]
        })
    } else {
        const existingItem = cart.items.find(item => item.product.toString() === productId.toString() && item.size === size)
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity
            if (newQuantity > selectedVariant.stock) {
                throw new ApiError(400, `Only ${selectedVariant.stock} items available for size ${size}`)
            }
            existingItem.quantity = newQuantity
        } else {
            cart.items.push({ product: productId, quantity, size })
        } await cart.save()
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
    let cart = await Cart.findOne({ user: userId })
        .select("-createdAt -updatedAt -__v")
        .populate({
            path: "items.product",
            select: "-createdAt -updatedAt -__v"
        })

    if (!cart) {
        return res.status(200).json(
            new ApiResponse(200, [], "Cart is empty")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, cart, "Cart retrieved successfully")
    )
})
const updateCartItemQuantity = AsyncHandler(async (req, res) => {
    const userId = req.user._id
    const { productId, quantity } = req.body

    if (!productId || !quantity || quantity < 1) {
        throw new ApiError(400, "productId and valid quantity are required");
    }
    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    if (quantity > product.stock) {
        throw new ApiError(400, `Only ${product.stock} items available`)
    }
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }
    const item = cart.items.find(i => i.product.toString() === productId.toString());
    if (!item) {
        throw new ApiError(404, "Product not found in cart");
    }
    item.quantity = quantity
    await cart.save()

    const updatedCart = await Cart.findOne({ user: userId })
        .select("-createdAt -updatedAt -__v")
        .populate({ path: "items.product", select: "_id productname quantity price description" })

    return res.status(200).json(
        new ApiResponse(200, updatedCart, "Cart item quantity updated successfully")
    )

})
const removeFromCart = AsyncHandler(async (req, res) => {
    const userId = req.user._id
    const { productId } = req.params

    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }
    const cartItem = await cart.items.find(i => i.product.toString() === productId.toString())
    if (!cartItem) {
        throw new ApiError(404, "Product not found in cart")
    }
    cart.items.pull(cartItem)
    await cart.save()

    return res.status(200).json(
        new ApiResponse(200, null, "Product removed from cart successfully")
    )
})
const clearCart = AsyncHandler(async (req, res) => {
    const userId = req.user._id
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }
    cart.items = []
    await cart.save()
    return res.status(200).json(
        new ApiResponse(200, null, "Cart cleared successfully")
    )
})

export { addToCart, getMyCartItems, removeFromCart, updateCartItemQuantity, clearCart }