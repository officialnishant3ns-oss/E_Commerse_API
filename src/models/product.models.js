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
            trim: true,
        },
        productimages: {
            type: [
                {
                    type: String,
                    required: true,
                }
            ],
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            default: 0,
            min: 0
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
        sizes: {
            type: [String],
            default: []
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model("Product", productSchema)
