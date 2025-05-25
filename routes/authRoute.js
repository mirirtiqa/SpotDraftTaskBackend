
import express from "express"
import {signup,login,forgotPassword,resetPasswordUsingLink} from "../controller/authController.js"
const userRoute = express.Router(); 

userRoute.post('/signup', signup);
userRoute.post('/login', login);
userRoute.post('/forgot-password', forgotPassword);
userRoute.post('/reset-password/:token', resetPasswordUsingLink);



export default userRoute;

