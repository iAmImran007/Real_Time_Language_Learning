import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password:{
        type: String,
        required: true,
        minlength: 6,
    },

    bio: {
        type: String,
        default: "",
    },

    profilePic: {
        type: String,
        default: "",
    },

    nativeLanguge: {
        type: String,
        default: "",
    },

    learningLanguge: {
        type: String,
        default: "",
    },

    location: {
        type: String,
        default: "",
    },

    isOnboarded: {
        type: Boolean,
        default: false,
    },

    frends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]

}, {timestamps:true})



const User = mongoose.model("User", userSchema)


export default User