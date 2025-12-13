import AsyncHandler from "../utils/asynchandler.js"
import ApiError from "../utils/apierror.js"
import ApiResponse from "../utils/apiresponse.js"
import Order from "../models/order.models.js"
import asyncHandler from "../utils/asynchandler.js"
import Product from "../models/product.models.js"

const placeOrderCOD = asyncHandler(async (req, res) => {
    const { orderItems, address } = req.body

    if (!orderItems || orderItems.length === 0) {
        throw new ApiError(400, "Order items are required")
    }

    if (!address) {
        throw new ApiError(400, "Shipping address is required")
    }

    let orderPrice = 0
    const validatedItems = []

    for (const item of orderItems) {
        const product = await Product.findById(item.productId)

        if (!product) {
            throw new ApiError(404, "Product not found")
        }

        if (!item.quantity || item.quantity < 1) {
            throw new ApiError(400, "Invalid quantity")
        }

        if (!item.size) {
            throw new ApiError(400, "Product size is required")
        }

        orderPrice += product.price * item.quantity

        validatedItems.push({
            productId: product._id,
            quantity: item.quantity,
            price: product.price,
            size: item.size,
        })
    }

    const order = await Order.create({
        customer: req.user._id,
        orderItems: validatedItems,
        address,
        orderPrice,
        paymentMethod: "cod",
        status: "pending",
    })

    return res.status(201).json(
        new ApiResponse(201, order, "Order placed successfully with Cash on Delivery")
    )
})
const placeOrderStripe = asyncHandler(async (req, res) => {
})
const placeOrderRazorpay = asyncHandler(async (req, res) => {
})
const getallOrders = asyncHandler(async (req, res) => {
})
const updateOrderStatus = asyncHandler(async (req, res) => {
})

const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const orders = await Order.find({ customer: userId })
        .populate("orderItems.productId", "productname price")
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, orders, "User orders fetched successfully")
    )
})


export {
    placeOrderCOD,
    placeOrderStripe,
    placeOrderRazorpay,
    getallOrders,
    updateOrderStatus,
    getMyOrders
}