import express from "express"
import { protectedRoute } from "../middleware/auth.Middleware.js"
import { getStreamToken } from "../controllers/chat.Controller.js"

const router = express.Router()



router.get("/token", protectedRoute, getStreamToken)


export default router