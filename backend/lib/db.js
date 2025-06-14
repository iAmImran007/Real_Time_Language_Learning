import mongoose from "mongoose"


export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongDb Connceted: ${conn.connection.host}`);

    }catch(error){
        console.log("Error whhile connectin to mongodb", error);
        process.exit(1) //1 means faliture
    }
}