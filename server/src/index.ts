import express from 'express'
import dotenv from 'dotenv'
import twilio from 'twilio'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import mongoose from 'mongoose'
import User from './model/user'
import authRouter from './routes/auth'
import userRouter from './routes/user'
import cookieParser from 'cookie-parser'
import newChat from './socket/chat'
import { ISignIn, IChat } from './interface'
import { verifyToken } from './middleware/verifyToken'


dotenv.config()
//cloudinary tokens

const MONGO_URI = process.env.MONGO_URI


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
//     origin: 'http://localhost:5173'
    origin: true,
    credentials: true
}))

if (typeof MONGO_URI === 'string') {
    mongoose.connect(MONGO_URI).then(() => {
        console.log('db connected');
    })
    .catch(() => {
        console.log('db not connected');
    })
}

app.use('/auth', authRouter)
app.use('/users', userRouter)


//socket.io server setup
const server = http.createServer(app)
const io = new Server(server)

//handle socket requests
io.on('connection', (socket) => {
    // console.log(socket.id)

    socket.on('message', (data, room) => {
        newChat(data)
        if(room == ''){
            socket.broadcast.emit('message', data)
        }
        else{
            socket.to(room).emit('message', data)
        }
    })

    socket.on('join', (room)=>{
        socket.join(room)
        socket.broadcast.emit('new-join', room)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})


app.get('/', verifyToken, (req, res) => {
    res.send('hello world')
})

server.listen(3000, () => {
    console.log('backend -> http://localhost:3000');
})