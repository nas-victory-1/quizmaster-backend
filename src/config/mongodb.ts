import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectToDb = async() =>{
    try {
       await mongoose.connect(process.env.MONGO_URI);
       console.log("Connected to database"); 
    } catch (error) {
        console.error("Error caused by ", error);
        process.exit(1);
    }
}