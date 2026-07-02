import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const[aToken,setAtoken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const[doctors,setDoctors] = useState([])
    const[appointments,setAppointments] = useState([])
    const[dashData,setDashdata] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getAlldoctors = async () => {
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/all-doctors',{},{headers:{aToken}})
            if(data.success){
                setDoctors(data.doctors)
                console.log(data.doctors)
            } else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
}

    const changeAvailability = async (docId) => {
            try {
                const {data} = await axios.post(backendUrl + '/api/admin/change-availability',{docId},{headers:{aToken}})
                if(data.success){
                    toast.success(data.message)
                    getAlldoctors()
                }
                else{
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
    }


    const getallAppointments = async () => {
        try {

            const {data} = await axios.get(backendUrl+'/api/admin/appointments',{headers:{aToken}})
            console.log(data)
            if(data.success){
                setAppointments(data.appointments)
                console.log(data.appointments)
                console.log('helloo')
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }
    const cancelAppointment = async (appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getallAppointments()
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }

    }


    const getDashdata = async ()=> {
        try {
            const {data} = await axios.get(backendUrl+'/api/admin/dashboard-data',{headers:{aToken}})
            console.log(data)
            console.log('hello')
            if(data.success){
                setDashdata(data.dashData)
                toast.success(data.message)
                console.log(data.dashData)
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken,setAtoken,
        backendUrl,
        doctors,getAlldoctors,
        changeAvailability,
        appointments,setAppointments,
        getallAppointments,cancelAppointment,
        dashData,getDashdata
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider