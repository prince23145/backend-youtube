import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from '../middelwares/multer.middelware.js'
import { verifyJwt } from "../middelwares/auth.middelware.js";
const router = Router()

router.route("/register").post((upload.fields([
  {
    name:"avatar",
    maxCount:1
  },
  {
    name:"coverImage",
    maxCount:1
  }
])),registerUser)


router.route("/login").post(loginUser)

// secure route
router.route("/logout").post(verifyJwt,logoutUser)


export default  router