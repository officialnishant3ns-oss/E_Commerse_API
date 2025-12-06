import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true
        },
        cartdata: {
            items: {
                type: Array,
                default: []
            },
            totalQuantity: {
                type: Number,
                default: 0
            },
            totalPrice: {
                type: Number,
                default: 0
            }
        },
        refreshtoken: {
            type: String
        }

    },
    { timestamps: true }
)




const User = mongoose.model("User", userSchema);
export default User