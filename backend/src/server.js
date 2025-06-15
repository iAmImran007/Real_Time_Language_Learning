import express from "express"
import dotenv from "dotenv"
import coockieParser from "cookie-parser"


import authRoutes from "./routes/auth.Roures.js"
import userRoutes from "./routes/user.Route.js"
import { connectDB } from "./lib/db.js"


const app = express()
dotenv.config()
const port = process.env.PORT


app.use(express.json())
app.use(coockieParser())



app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)



app.listen(port, () => {
    console.log(`Server is runing on port ${port}`);
    connectDB()
})

//51:18