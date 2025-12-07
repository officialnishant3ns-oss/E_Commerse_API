import ApiError from "../utils/apierror.js"
import ApiResponse from "../utils/apiresponse.js"
import AsyncHandler from "../utils/asynchandler.js"
import User from "../models/user.models.js"
import emailValidator from "email-validator"

const AccesstokenAndRefreshtokenGenerate = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found while generating tokens")
        }
        const refreshtoken = await user.generateRefreshToken()
        const accesstoken = await user.generateAccessToken()

        user.refreshtoken = refreshtoken
        await user.save({ validateBeforeSave: true })
        return { accesstoken, refreshtoken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating user")
    }
}
const register = AsyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        throw new ApiError(400, "Please Enter Required fields")
    }
    const userExist = await User.findOne({ email })
    if (userExist) {
        throw new ApiError(409, "User Already Exist Pls Go to Login")
    }
    if (!emailValidator.validate(email)) {
        throw new ApiError(400, "Please enter a valid email address")
    }
    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long")
    }
    const user = await User.create({
        email,
        password,
        username: username.toLowerCase()
    })
    const createduser = await User.findById(user._id).select(
        "-password -refreshtoken -createdAt -updatedAt -__v"
    )
    if (!createduser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createduser, "User registered successfully")
    )
})
const login = AsyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new ApiError(400, "Please enter required fields")
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User not found, please register")
    }
    const isPasswordmatch = await user.isPassword(password)
    if (!isPasswordmatch) {
        throw new ApiError(401, "Invalid credentials, please try again")
    }

    const { accesstoken, refreshtoken } = await AccesstokenAndRefreshtokenGenerate(user._id)

    const loggegInUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200)
        .cookie("refreshtoken", refreshtoken, options)
        .cookie("accesstoken", accesstoken, options)
        .json(
            new ApiResponse(200, loggegInUser, "User logged in successfully")
        )
})
const logout = AsyncHandler(async (req, res) => {
  console.log("User logged out:", req.user)
   await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshtoken: undefined
            }
        },
        {
            new: true
        }
    )
  
    const option = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accesstoken", option)
        .clearCookie("refreshtoken", option).json(
            new ApiResponse(200, {}, "User logged out")
        )
}
)
const adminLogin = AsyncHandler(async (req, res) => {
    // Admin login logic here
    
})
export { register, login , logout, adminLogin}