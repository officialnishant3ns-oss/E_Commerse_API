import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    gateway: {
      type: String,
      enum: ["razorpay", "stripe", "paypal"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {     //look if needed >>
      type: String,
      default: "INR",
    },

    gatewayOrderId: {
      type: String,
    },

    gatewayPaymentId: {
      type: String,
    },

    gatewaySignature: {
      type: String,
    },

    status: {
      type: String,
      enum: ["created", "pending", "success", "failed", "refunded"],
      default: "created",
    },

    paymentMethod: {
      type: String,
    },
  },
  { timestamps: true }
)


const Payment = mongoose.model("Payment", paymentSchema)
export default Payment