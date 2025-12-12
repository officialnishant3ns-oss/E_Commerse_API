import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        productname: {
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        productimages: {
            type: [String],
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            trim: true,
            required: true
        },
        subcategory: {
            type: String,
            trim: true,
            default: ""
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        },
        sizes: {
            type: [String],
            required: true,
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Product", productSchema)
