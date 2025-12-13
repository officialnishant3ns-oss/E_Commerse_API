import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
    }
})

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderPrice: {
            type: Number,
            required: true,
        },
        orderItems: {
            type: [orderItemSchema],
            required: true,
        },
        address: {
            fullName: String,
            phone: String,
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: {
                type: String,
                default: "India",
            },
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["cod", "online"],
            required: true,
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
        }
    },
    {
        timestamps: true,
    }
)

export default mongoose.model("Order", orderSchema)