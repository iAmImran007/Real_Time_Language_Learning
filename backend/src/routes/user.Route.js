import express from "express"
import { getRecomendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest } from "../controllers/user.Controller"



const router = express.Router()

//call middleware for every single routes
router.use(protectedRoute)


router.get("/", getRecomendedUsers)
router.get("/friends", getMyFriends)
router.post("/friend-request/:id", sendFriendRequest)
router.post("/friend-request/:id/accept", acceptFriendRequest)


export default router;