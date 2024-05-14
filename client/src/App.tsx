import { useEffect, useState } from 'react';
import './App.css'
import { Login } from './components/Login'
import { Home } from './components/Home'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true

function App() {

    const [isAuth, setIsAuth] = useState(false)
    const [userMobileNo, setUserMobileNo] = useState('')

    useEffect(() => {
        const token = window.localStorage.getItem('token')
        if(token){
            setIsAuth(true)
        }
    }, [])
    

    return (
        <>
            {
                isAuth ?
                    <Home userMobileNo={userMobileNo}/> : 
                    <Login setIsAuth={setIsAuth} setUserMobileNo={setUserMobileNo}/> 
            }
        </>
    )
}

export default App
