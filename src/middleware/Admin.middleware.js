import ApiError from "../utils/apierror.js"

const adminAuth = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin only route")
    }
    next()
}

export default adminAuth
