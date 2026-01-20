import express from  "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGEN,
    credentials:true
}))  

app.use(express.json({limit:"56kb"}))
app.use(express.urlencoded({extended: true,limit:"56kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes
import userrouter from "./routes/user.routes.js"

//routes declaration
app.use("/api/v1/users",userrouter)





export {app}