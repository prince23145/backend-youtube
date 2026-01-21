import { ApiError } from "../utilis/ApiError";
import { asynchandler } from "../utilis/asynchandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
export const verifyJwt = asynchandler(async (req, res, next) => {
try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token){
            throw new ApiError(401,"unauthorized requested")
        }
    
       const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
     
     const user=  await User.findById(decodedToken?._id).select("-password -refreshToken")
    
     if(!user){
        throw new ApiError(401,"Invaleid Access Token")
     }
     req.user=user
     next()
} catch (error) {
    throw new ApiError(400,error.message|| "invailed access token")
}

});
