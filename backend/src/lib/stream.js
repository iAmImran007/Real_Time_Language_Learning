import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET



if(!apiKey || !apiSecret) {
    console.log("Stream api key or secret is missing");
}


const streamClient = StreamChat.getInstance(apiKey, apiSecret)

export const upStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting stream user:", error);
    }
};


//ganaret token 
export const generateStreamToken = (userId) => {
    try{
        //ensusre user id is a sting
        const userIdStr = userId.toString()
        return streamClient.createToken(userIdStr)
    }catch(error){
        console.error("Error ganaretinf stream token");
    }
}

