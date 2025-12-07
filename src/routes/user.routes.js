import { Router } from "express"
import { login, logout, register } from "../controllers/user.controllers.js"
const router = Router()


// User Routes
router.route("/register").post(register)    
router.route("/login").post(login)
router.route("/logout").post(logout)

export default router