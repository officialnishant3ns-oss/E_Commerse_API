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


userschema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password =await bcrypt.hash(this.password, 10)
    next()
})

userschema.methods.isPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);
export default User