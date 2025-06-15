import User from "../models/User.js"
import FriendRequest from "../models/freindRequest.js"


export async function getRecomendedUsers(req, res) {
    try{
        const currentUserId = req.user.id
        const currentUser = req.user

        const recomendedUser = await User.find({
            $and: [
                {_id: {$ne: currentUserId}}, //exclude current user 
                {$id: {$nin: currentUser.friends}}, //exclude current user freind
                {isOnboarded: true}
            ]
        })

        res.status(200).json(recomendedUser)

    }catch(error){
        console.error("Error in recomended users controller", error.message);
        res.status(500).json({
            message: "Internal server error"
        })
        
    }
}


export async function getMyFriends(req, res) {
    try{
        const user = await User.findById(req.user.id).select("friends")
        .populate("friends", "fullName profilePic nativeLanguge learningLanguge")

        res.status(200).json(user.friends)

    }catch(error){
        console.error("Error in getMyFreind controller", error.message);
        res.status(500).json({
            message: "Internal server error",
        })
    }
}


export async function sendFriendRequest(req, res) {
    try{
        const myId = req.user.id
        const { id:recipientId } = req.params

        //preventing sending reqest to ourself
        if(myId == recipientId) {
            return res.status(400).json({
                message: "You cant send freind req to your self",
            })
        }

        const recipient = await User.findById(recipientId)
        if(!recipient){
            return res.status(404).json({
                message: "Recipiant not found",
            })
        }

        //check if we are alredy freinds or not
        if(recipient.friends.includes(myId)){
            return res.status(400).json({
                message: "You are alredy freind with this user",
            })
        }

        //check if a req alredy exsist
        const exsistingRequest = await FriendRequest.findOne({
            $or: [
                {sender:myId, recipient: recipientId},
                {sender: recipientId, recipient: myId},
            ],
        })

        if(exsistingRequest) {
            return res.status(400).json({
                message: "A freind request alredy exsist bitween you and this user",
            })
        }

        //now create a freind request
        const freindRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        })

        //send success
        res.status(201).json(freindRequest)

    }catch(error){
        console.error("Error in sendFriendRequest controler", error.message);
        res.status(500).json({message: "Internal server error"})
    }
}


export async function acceptFriendRequest(req, res) {
    try{
        const {id:requestId} = req.params
        const freindRequest = await FriendRequest.findById(requestId)

        if(!freindRequest) {
            return res.status(404).json({
                message: "Friend request not found",
            })
        }

        //verify the current user is recipent or not 
        if(freindRequest.recipient.toString() != req.user.id){
            return res.status(403).json({
                message: "You are not authorized to accept this request",
            })
        }

        //accepted the friend request
        freindRequest.status = "accepted"
        await freindRequest.save()

        //add each users to others freind arry
        await User.findByIdAndUpdate(freindRequest.sender, {
            $addToSet: {friends: freindRequest.recipient}
        })

        await User.findByIdAndUpdate(freindRequest.recipient, {
            $addToSet: {friends: freindRequest.sender}
        })

        //send success messge
        res.status(200).json({
            message: "Freind request accepeted",
        })

    }catch(error){
        console.log("Error in accepetFreindRequest controller", error.message);
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}


export async function getFriendRequest(req, res) {
    try{
        const incomingRequest = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguge learningLanguge")

        const acceptedReq = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullname profilePic");

        res.status(200).json({incomingRequest, acceptedReq})

    }catch(error){
        console.log("Error in getPendingFreindRequest controller", error.message);
        res.status(500).json({
            message: "Internal server Error"
        })
    }
}


export async function getOutGoingFreindRequest(req, res) {
    try{
        const outgoingRequest = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullname profilePic nativeLanguge learningLanguge")

        res.status(200).json(outgoingRequest)
    }catch(error){
        console.log("Error in getoutgoing freind requiest", error.message);
        res.status(500).json({message: "Internal server error"})
    }
}
