import { useState } from "react"
import axios from "axios"


export const Login = ({setIsAuth, setUserMobileNo}:{setIsAuth: React.Dispatch<React.SetStateAction<boolean>>, setUserMobileNo: React.Dispatch<React.SetStateAction<string>>}) => {
    const [register, setRegister] = useState(false)
    const [mobileNo, setMobileNo] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [OTP, setOTP] = useState<number>(0)

    const resetProps = () => {
        setMobileNo('')
        setPassword('')
        setFirstName('')
        setLastName('')
        setOTP(0)
    }

    const handleLogin = async (e: any) => {
        e.preventDefault()
        try {
            console.log(mobileNo, password) ;
            
            const user = await axios.post('/auth/login',{
                mobileNo: `+91${mobileNo}`,
                password
            })
            console.log(user.status);
            if(user.status == 200){
                // dummy auth for client side
                window.localStorage.setItem('token', 'auth_token');
                setIsAuth(true)
            } 
            setUserMobileNo(mobileNo)
            resetProps()
        }   
        catch(err){
            console.log(err);
        }
    }

    const handleRegister = async (e: any) => {
        e.preventDefault()
        try {
            const user = await axios.post('/auth/register',{
                mobileNo: `+91${mobileNo}`,
                password,
                firstName,
                lastName
            })
            console.log(user.status);
        }   
        catch(err){
            console.log(err);
        }
    }

    const submitOtp = async () => {
        try {
            console.log(OTP);
            const user = await axios.post('/auth//register/verify',{
                otp: OTP
            })
            console.log(user.status);
        }   
        catch(err){
            console.log(err);
        }
    }

    const submitPassword = async () => {
        try {
            const user = await axios.post('/auth/setpassword',{
                password
            })
            console.log(user.status);
            resetProps()
            alert('user registration successful')
        }   
        catch(err){
            console.log(err);
        }
    }

    return (
        <>
            <div style={{cursor: 'pointer'}} onClick={() => setRegister(prev => !prev)}>{register? 'click here to login' : 'click here to register'}</div>
            {
                register ? (
                    <div>
                        <form onSubmit={handleRegister}>
                            <label>first name</label>
                            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
                            <label>last name</label>
                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                            <label>mobile no.</label>
                            <input type="text" value={mobileNo} onChange={e => setMobileNo(e.target.value)} />
                                <button type="submit" >register</button>
                        </form> 
                        
                        <label>otp</label>
                        <input type="text" value={OTP} onChange={e => setOTP(Number(e.target.value))} />
                        <button onClick={submitOtp}>submit otp</button>

                        <label>password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button onClick={submitPassword}>set password</button>
                    </div>
                ): 
                    <form onSubmit={handleLogin}>
                        <label>mobile no.</label>
                        <input type="text" value={mobileNo} onChange={e => setMobileNo(e.target.value)} />
                        <label>password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button type="submit" >login</button>
                    </form>
            }
        </>
    )
}