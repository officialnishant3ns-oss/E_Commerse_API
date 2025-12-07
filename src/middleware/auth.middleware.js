import ApiError from "../utils/apierror.js"
import AsyncHandler from "../utils/asynchandler.js"
import jwt from "jsonwebtoken"
import User from "../models/user.models.js"

const verifyJWT = AsyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "unauthorized request there tOKEN missing")
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded?._id).select(
            "-password -refreshtoken"
        )
        if (!user) {
            throw new ApiError(401, "invalid Access token")
        }
        req.user = user
        next()
    } catch (error) {
        console.error("Error in verifyJWT middleware:", error)
        throw new ApiError(401, "Unauthorized request here")
    }
}
)
export default verifyJWT