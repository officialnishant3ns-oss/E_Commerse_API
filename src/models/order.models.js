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
})

const orderSchema = new mongoose.Schema(
    {
        orderPrice: {
            type: Number,
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderItems: {
            type: [orderItemSchema],
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "cancelled", "delivered"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Order", orderSchema)