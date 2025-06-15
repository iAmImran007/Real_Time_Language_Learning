import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { upStreamUser } from "../lib/stream.js"



export async function signup(req, res){
    const {fullName, email, password} = req.body

    try{
        //check for inputs
        if(!fullName || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All feilds are required",
            })
        }
        //check for valid password
        if(password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "password must be at least 6 charactes",
            })
        }
        //check for valid email
         const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

         if(!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            })
         }

         //check is user is alredy exist or not
         const exsistingUser =  await User.findOne({email})
         if (exsistingUser) {
            return res.status(400).json({
                success: false,
                message: "Email alredy exsist try with diffrent one",
            })
         }

         //create a random image for user
         const idx = Math.floor(Math.random() * 100) + 1;
         const randomAvatar = `https://avatar. iran. Liara. run/public/${idx}.png`

         //save the user in the database with random avtar
         const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
         })

         //add user to the stream api
        try{
            await upStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || "",
         })
         console.log(`Stream user created for ${newUser.fullName}`);
         
        }catch(error){
            console.log("Error creating stream user:", error);
        }

         const token = jwt.sign({userID:newUser._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
         })

         res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 *1000,
            httpOnly: true, //prevent xss attack
            sameSite: "strict", //prevent csrf attack
            secure: process.env.NODE_ENV === "production",
         })

         //send success messege
         res.status(201).json({
            success: true,
            user: newUser,
         })

    }catch(error){
        console.log("Error in signup controler", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}


export async function login(req, res){
    try{
        const {email, password} = req.body
        
        //check emal are password is in the input or not
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All feilds are requierd",
            })
        }

        //check in the user input email is avalable or not
        const user = await User.findOne({email})
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or passowrd",
            })
        }

        //chek is input password is corret or not 
        const isPassword = await user.matchPassword(password)
        if(!isPassword) {
            return res.status(401).json({
                success: false,
                message: "invalid email or password",
            })
        }

        //create a token for user
        const token = jwt.sign({userID:user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
         })

         res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 *1000,
            httpOnly: true, //prevent xss attack
            sameSite: "strict", //prevent csrf attack
            secure: process.env.NODE_ENV === "production",
         })

         //send success status
         res.status(200).json({
            success: true,
            message: "Login successfully",
         })
    }catch(error){
        console.log("Error in login controler", error);
        res.status(500).json({message: "Internal server error"})
    }
}


export function logout(req, res){
    //clear the jwt cookie
    res.clearCookie("jwt")

    //send success messege
    res.status(200).json({
        success: true,
        message: "Logout successfully",
    })
}


export async function onboard(req, res) {
    try{
        const userId = req.user._id

        const { fullName, bio, nativeLanguge, learningLanguge, location } = req.body

        if(!fullName || !bio || !nativeLanguge || !learningLanguge || !location) {
            return res.status(400).json({
                success: false,
                message: "All feild are requier",
                messingFeilds:[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguge && "nativeLanguge",
                    !learningLanguge && "learningLanguge",
                    !location && "location"

                ].filter(Boolean)
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, {new: true})

        if(!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        //update user onboarding details to stream api
        try{
            await upStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic || "",
        })
        console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);

        }catch(streamError){
            console.log("Error updating stream user during onbording", streamError.message);
        }

        //send the success messge
        res.status(200).json({
            success: true,
            user: updatedUser,
        })

    }catch(error){
        console.log("Onboarding error", error);
        res.status(500).json({
            message: "Internal server error",
        })
    }
}