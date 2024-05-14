import express, { Request, Response } from 'express'
import twilio from 'twilio'
import dotenv from 'dotenv'
import User from '../model/user';
import { ISignIn, IUser } from '../interface'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../middleware/verifyToken';

dotenv.config()


const sid = process.env.SID
const authToken = process.env.TOKEN
const jwtSecret = process.env.JWT_SECRET
const client = twilio(sid, authToken)

let OTP: number
let moNo: string
let fName: string
let lName: string

//register
export async function register(req: Request, res: Response){
    try {
        const { mobileNo, firstName, lastName }: ISignIn = req.body;
        moNo = mobileNo
        fName = firstName
        lName = lastName
        const otp = Math.floor(Math.random() * 10000)
        OTP = otp
        // docs -> https://github.com/twilio/twilio-node
        client.messages.create({
            from: '+18507805841',
            to: mobileNo,
            body: `Hi ${firstName} this is your otp for chat-app ${otp}`
            }).then(message => console.log(message.sid))
            .catch(err => {
                return res.send(err)    
            })
        res.send(otp.toString())
    }
    catch {
        (err: unknown) => {
            res.status(500).send(err)
        }
    }
}

//otp verification
export async function verifyRegister(req: Request, res: Response){
    try {
        const { otp }: { otp: number } = req.body   
        //otp -> undefined
        if (!otp) {
            return res.status(400).send('otp not found')
        }
        //correct otp
        if (otp === OTP) {
            OTP = -1
            return res.status(201).send('User verified')
        }

        res.send("Wrong otp")
    }
    catch {
        (err: unknown) => {
            console.log(err);
            res.status(500).send('error in otp verifivation')
        }
    }
}

//set new password (create user)
export async function setPassword (req: Request, res: Response){
    try {
        const { password }: { password: string } = req.body
        //passwrod -> undefined
        if (!password) {
            return res.status(400).send('otp not found')
        }
        if (OTP !== -1) {
            return res.status(400).send('user not verified you can not set password')
        }
        OTP = 0
        //hash password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            firstName: fName,
            lastName: lName,
            mobileNo: moNo,
            password: passwordHash
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        res.status(201).send('new user created')
    }
    catch {
        (err: unknown) => {
            console.log(err);
            res.status(500).send('error in password setting')
        }
    }
}

export async function login(req: Request, res: Response){
    try {
        const { mobileNo, password } = req.body
        //credential not found
        if (!mobileNo || !password) {
            return res.status(401).send('invalid credentials')
        }
        //find user in db
        const user: (IUser | null) = await User.findOne({ mobileNo })
        console.log(user);
        //user not found
        if (!user) {
            return res.status(404).send('user not found')
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).send('Invalid credentials');

        if (typeof jwtSecret !== 'string') {
            return res.status(400).send('Login -> jwt secret error');
        }

        const token = jwt.sign({ id: user._id }, jwtSecret);

        res.cookie('token', token, {httpOnly: true})
        user.password = ''
        res.status(200).json({ token, user });

    }
    catch {
        (err: unknown) => {
            console.log(err);
            res.status(500).send('bad request')
        }
    }
}
