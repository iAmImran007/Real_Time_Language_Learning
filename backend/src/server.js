import express from "express"
import dotenv from "dotenv"


import authRoutes from "./routes/auth.Roures.js"
import { connectDB } from "../lib/db.js"


const app = express()
dotenv.config()
const port = process.env.PORT



app.use("/api/auth", authRoutes)



app.listen(port, () => {
    console.log(`Server is runing on port ${port}`);
    connectDB()
})