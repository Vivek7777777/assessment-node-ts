import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router();
router.use(cookieParser())

const jwtSecret = process.env.JWT_SECRET

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).send('unauthorized');
    if (typeof jwtSecret !== 'string') return res.status(400).send('Verify token -> jwt secret error');
    const verified = jwt.verify(token, jwtSecret)
    console.log(verified);
    
    next()
}