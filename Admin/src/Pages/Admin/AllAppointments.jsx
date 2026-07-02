import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../Context/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { assets } from "../../assets/assets_admin/assets";



const AllAppointments = () => {
  const { aToken, appointments, getallAppointments,cancelAppointment } = useContext(AdminContext);
  const {calculateAge,currency,} = useContext(AppContext)
  useEffect(() => {
    if (aToken) {
      getallAppointments();
    }
  }, [aToken]);
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white rounded text-sm max-h-[80vh] overflow-y-scroll min-h-60vh">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor Name</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item,index)=>(
          <div className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50" key={index}>
            <p className="max-sm:hidden">{index+1}</p>
            <div className="flex items-center gap-2">
              <img className="w-8 rounded-full" src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.Dob)}</p>
            <p>{item.slotData},{item.slotTime}</p>
            <div className="flex items-center gap-2">
              <img className="w-8 rounded-full bg-gray-200" src={item.doctorData.image} alt="" /> <p>{item.doctorData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            {item.cancelled? <p className="text-red-600 text-xs font-medium">Cancelled</p>: item.isCompleted ? <p className="text-green-500 text-xs font-medium">Completed</p> :<img onClick={()=>cancelAppointment(item._id)} className="w-10 cursor-pointer" src={assets.cancel_icon} alt="" />}
           </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
