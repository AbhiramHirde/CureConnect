import React, { useContext, useState } from 'react'
import { AdminContext } from '../Context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../Context/DoctorContext'
const Login = () => {
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setAtoken, backendUrl } = useContext(AdminContext)
    const {setDtoken} = useContext(DoctorContext)

    const onsubmitHandler = async (event) => {
        event.preventDefault()
        try {
            if (state === 'Admin') {  // ✅ Strict comparison
                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
                
                if (data.success) {
                    localStorage.setItem('aToken',data.token)
                    console.log(data.token)
                    setAtoken(data.token)
                }
                else {
                    toast.error(data.message)
                }
            } else{
                const {data} = await axios.post(backendUrl +'/api/doctor/login',{email,password})
                if (data.success) {
                    localStorage.setItem('dToken',data.token)
                    console.log(data.token)
                    setDtoken(data.token)
                    console.log(data)
                    
                }

            }
        } catch (error) {
            console.error('Login failed:', error)
        }
    }

    return (
        <form onSubmit={onsubmitHandler} className="min-h-[80vh] flex justify-center items-center">  
            <div className="flex flex-col gap-3 items-start p-6 w-80 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white">
                <p className="text-lg font-semibold">
                    <span>{state}</span> Login
                </p>

                <div className="w-full">
                    <p className="mb-1">Email</p>
                    <input 
                        onChange={(e) => setEmail(e.target.value)}  // ✅ Fixed event handler
                        type="email" 
                        required 
                        className="w-full p-2 border rounded" 
                        value={email} 
                    />
                </div>

                <div className="w-full">
                    <p className="mb-1">Password</p>
                    <input  
                        onChange={(e) => setPassword(e.target.value)}  // ✅ Fixed event handler
                        type="password" 
                        required 
                        className="w-full p-2 border rounded" 
                        value={password} 
                    />
                </div>

                <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Login
                </button>

                {
                    state === 'Admin' ? (
                        <p>
                            Doctor Login? 
                            <span 
                                className='text-blue-400 underline cursor-pointer' 
                                onClick={() => setState('Doctor')}
                            >
                                Click Here
                            </span>
                        </p>
                    ) : (
                        <p>
                            Admin Login? 
                            <span 
                                className='text-blue-400 underline cursor-pointer'  
                                onClick={() => setState('Admin')}
                            >
                                Click Here
                            </span>
                        </p>
                    )
                }
            </div>
        </form>
    )
}

export default Login
