import ApiError from "../utils/apierror.js"
import ApiResponse from "../utils/apiresponse.js"
import AsyncHandler from "../utils/asynchandler.js"

import User from "../models/user.models.js"

const register = AsyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        throw new ApiError(400, "Please Enter Required fields")
    }
    const userExist = await User.findOne({ email })
    if (userExist) {
        throw new ApiError(409, "User Already Exist Pls Go to Login")
    }
    const user = await User.create({
        email,
        password,
        username: username.toLowerCase()
    })
    const createduser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )
    if (!createduser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createduser, "User registered successfully")
    )
})

export { register }