import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../Context/DoctorContext'
import { useEffect } from 'react'
import { AppContext } from '../../Context/AppContext'
import { assets } from '../../assets/assets_admin/assets'

const DoctorAppointment = () => {
    const {dToken,appointment,setAppointment,getAppointments,completeAppointment,cancelAppointment} =useContext(DoctorContext)
    const {calculateAge,currency} = useContext(AppContext)
    useEffect(()=> {
        if(dToken){
            getAppointments()
        }

    },[dToken])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
        <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
            <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
                <p>#</p>
                <p>Patient</p>
                <p>Payment Status</p>
                <p>Age</p>
                <p>Date & Time</p>
                <p>Fees</p>
                <p>Action</p>
            </div>
            {
  appointment.map((item, index) => (
    <div
      key={index}
      className="grid max-sm:grid-cols-1 max-sm:gap-3 grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center px-6 py-4 border-b"
    >
      <p>{index + 1}</p>
      <div className="flex items-center gap-2">
        <img src={item.userData.image} alt="user" className="w-8 h-8 rounded-full object-cover" />
        <p>{item.userData.name}</p>
      </div>
      <div>
        <p className={`font-medium ${item.payment ? 'text-green-600' : 'text-yellow-600'}`}>
          {item.payment ? 'ONLINE' : 'CASH'}
        </p>
      </div>
      <p>{calculateAge(item.userData.Dob)}</p>
      <p>{item.slotData} - {item.slotTime}</p>
      <p>{currency}{item.amount}</p>
      {
        item.cancelled
         ?
          <p className='text-red-500 text-xs font-medium'>Canclled</p>
           :
        item.isCompleted
            ?
            <p className='text-green-500 text-xs font-medium'>Completed</p>
            :
            <div className="flex gap-2">
        <img onClick={()=>cancelAppointment(item._id)} src={assets.cancel_icon} alt="cancel" className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
        <img onClick={()=>completeAppointment(item._id)} src={assets.tick_icon} alt="tick" className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
      </div>
      }
      
    </div>
  ))
}

        </div>


    </div>
  )
}

export default DoctorAppointment
