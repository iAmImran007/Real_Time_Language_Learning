import express from "express"
import { getRecomendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequest, getOutGoingFreindRequest } from "../controllers/user.Controller.js"
import { protectedRoute } from "../middleware/auth.Middleware.js"


const router = express.Router()

//call middleware for every single routes
router.use(protectedRoute)


router.get("/", getRecomendedUsers)
router.get("/friends", getMyFriends)
router.get("/firend-requests", getFriendRequest)
router.get("/outgoing-freind-request", getOutGoingFreindRequest)


router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest)


export default router;