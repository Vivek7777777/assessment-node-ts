import express, { Request, Response } from "express";
import { register, setPassword, verifyRegister, login } from "../controller/auth";
const router = express.Router();


//sending otp using twilio
router.post('/register', register)

//verifying otp 
router.post('/register/verify', verifyRegister)

//set password
router.post('/setpassword', setPassword)

//login
router.post('/login', login)


export default router;