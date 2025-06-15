import express from "express"
import { signup, login, logout, onboard } from "../controllers/auth.Controller.js"
import { protectedRoute } from "../middleware/auth.Middleware.js"



const router = express.Router()

//public routes
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

//protected route
router.post("/onboarding", protectedRoute ,onboard)
router.get("/me", protectedRoute, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    })
})


export default router