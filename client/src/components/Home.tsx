import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import { IChat } from '../interface';
// import axios from 'axios';
// import { IUserId } from '../interface';


const socket = io('http://localhost:3000', { transports: ['websocket'] });

export const Home = ({userMobileNo}: {userMobileNo: string}) => {

    // const [allUsers, setAllUsers] = useState<IUserId[]>([])
    // const [data, setData] = useState<any>()
    // const [userId, setUesrId] = useState<IUserId>({socketId: '', mobileNo: ''})
    const [chats, setChats] = useState<IChat[]>([])
    const [room, setRoom] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    // const [group, setGroup] = useState<string>('')

    // console.log(allUsers);
    
            socket.on('connect', () => {
                console.log(socket.id);
                // if(socket.id){
                //     setUesrId({
                //         socketId: socket.id,
                //         mobileNo: userMobileNo
                //     })
                //     setAllUsers(prev => [...prev, userId])
                // }
            })
    
    useEffect(() => {

        socket.on('message', (data: IChat, room) => {
            console.log(data, room);
            setChats(prev => [...prev, data])
        })

        socket.on('new-join', (room) => {
            const data = {
                from: 'na',
                to: 'na',
                message: `${socket.id} joined the ${room}. You can join too`
            }
            setChats(prev => [...prev, data])
        })

        // return () => {
        //     socket.disconnect()
        //     console.log('disconnected')
        // }
    }, [])

    const handleMessage = (e: any) => {
        e.preventDefault()
        if(typeof socket.id === 'undefined') return;
        const data: IChat = {
            from: socket.id,
            to: room,
            message
        }
        setChats(prev => [...prev, data])
        socket.emit('message', data, room)
        setMessage('')
    }

    const handleGroup = () => {
        socket.emit('join', room)
    }

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         console.log('fetching users');
            
    //         const response = await axios.get('/users')
    //         const result = response.data;
    //         setData(result)    
    //     }
    //     fetchUsers()
        
    // }, [])

    return (
        <>
            <button 
                style={{position: 'fixed', top: '0', right: '0'}} 
                onClick={() => {
                    window.localStorage.removeItem('token')
                    window.location.reload()
                }}
            >
                logout
            </button>

            {/* render chats */}
            <div>
                {chats.map((chat, index) => (
                    <div key={index}>
                        {chat?.message}
                    </div>
                ))}
            </div>

            {/* form */}
            <label htmlFor="">room</label>
            <input type="text" value={room} onChange={e => setRoom(e.target.value)} />
            <label >message</label>
            <input type="text" value={message} onChange={e => setMessage(String(e.target.value))} />
            <button onClick={handleMessage}>send</button>
            <button onClick={handleGroup}>JOIN ROOM</button>
        </>
    )
}