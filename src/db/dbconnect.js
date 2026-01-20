import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
const mongodb= async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("DATA BASE CONNECTED SUCCESFULLY ")
    } catch (error) {
        console.log("database connection error",error)
    }
}

export default mongodb