import dotenv from "dotenv"
import db_connection from "./db/dbconnect.js";
import { app } from "./app.js";
dotenv.config({
    path:'.env'
})


db_connection()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port at :${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("database connection error !!!" ,err)
})