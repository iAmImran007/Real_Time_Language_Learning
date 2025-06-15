import jwt from "jsonwebtoken"
import User from "../models/User.js"


export const protectedRoute = async (req, res, next) => {

    try{
        //check form req body is thare is any token 
        const token = req.cookies.jwt

        if(!token){
            res.status(401).json({
                success: false,
                messege: "Unauthorized - no token provided",
            })
        }

        //veryfiy the providede token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if(!decoded) {
            return res.status(401).json({
                success: false,
                messege: "Unothorized - invalid token",
            })
        }

        //check is thare is any user exsist with that token
        const user = await User.findById(decoded.userID).select("-password")

        if(!user) {
            return res.status(401).json({
                success: false,
                messege: "Unotorized - User not found"
            })
        }
        //call the next success 
        req.user = user
        next()

    }catch(error) {
        console.log("Internal server error", error);

        res.status(500).json({
            success: false,
            messege: "Internal server error"
        })
    }
}