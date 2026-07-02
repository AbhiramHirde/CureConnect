import React, { useContext } from 'react'
import {Route,Routes} from 'react-router-dom'
import Login from './Pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './Context/AdminContext';
import Navbar from './Components/Navbar';
import SideBar from './Components/SideBar';
import DashBoard from './Pages/Admin/DashBoard';
import AllAppointments from './Pages/Admin/AllAppointments';
import AddDoctors from './Pages/Admin/AddDoctors';
import DoctorsList from './Pages/Admin/DoctorsList';
import { DoctorContext } from './Context/DoctorContext';
import DoctorDashboard from './Pages/Doctor/DoctorDashboard';
import DoctorAppointment from './Pages/Doctor/DoctorAppointment';
import DoctorProfile from './Pages/Doctor/DoctorProfile';
const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)
  return aToken || dToken ?  (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <SideBar/>
        <Routes>
          {/* Admin Routes  */}
          <Route path='/' element = {<></>}/>
          <Route path='/admin-dashboard' element = {<DashBoard/>}/>
          <Route path='/all-appointments' element = {<AllAppointments/>}/>
          <Route path='/add-doctor' element = {<AddDoctors/>}/>
          <Route path='/doctor-list' element = {<DoctorsList/>}/>
          {/* Doctor Route */}
          <Route path='/doctor-dashboard' element = {<DoctorDashboard/>}/>
          <Route path='/doctor-appointment' element = {<DoctorAppointment/>}/>
          <Route path='/doctor-profile' element = {<DoctorProfile/>}/>
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App

