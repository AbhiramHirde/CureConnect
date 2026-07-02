import React, { useContext } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../Context/AdminContext'
import {useNavigate} from 'react-router-dom'
import { DoctorContext } from '../Context/DoctorContext'
const Navbar = () => {
    const {aToken,setAtoken} = useContext(AdminContext)
    const {dToken,setDtoken} = useContext(DoctorContext)
    const navigate = useNavigate()

    const logOut = () => {
        navigate('/')
        aToken && setAtoken ('')
        aToken && localStorage.removeItem('aToken')
        dToken && setDtoken ('')
        dToken && localStorage.removeItem('dToken')
    }
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={logOut} className='bg-blue-400 text-white text-sm px-10 py-2 rounded-full cursor-pointer'>LogOut</button>
    </div>
  )
}

export default Navbar
