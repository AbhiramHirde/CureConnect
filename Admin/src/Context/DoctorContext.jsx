import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const[dToken,setDtoken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'')
    const[appointment,setAppointment] = useState([])
    const[dashData,setDashdata] = useState(false)
    const[profileData,setProfiledata] = useState(false)

    const getAppointments = async ()=> {
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/appointments',{headers:{Authorization:`Bearer ${dToken}`}})
            console.log(data)
            if(data.success){
                setAppointment(data.appointments.reverse())
                console.log(data.appointments.reverse())
            } else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const completeAppointment = async (appointmentId) => {
        try {

        const {data} = await axios.post(backendUrl+'/api/doctor/complete-appointment',{appointmentId},{headers:{Authorization:`Bearer ${dToken}`}})
        console.log(data)
        if(data.success){
            toast.success(data.message)
            getAppointments()
        } else{
            toast.error(data.message)
        }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }



    const cancelAppointment = async (appointmentId) => {
        try {

        const {data} = await axios.post(backendUrl+'/api/doctor/cancel-appointment',{appointmentId},{headers:{Authorization:`Bearer ${dToken}`}})
        console.log(data)
        if(data.success){
            toast.success(data.message)
            getAppointments()
        } else{
            toast.error(data.message)
        }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const getDashdata = async () => {
        try {

            const {data} = await axios.get(backendUrl+'/api/doctor/dashboard',{headers:{Authorization:`Bearer ${dToken}`}})
            console.log(data)
            console.log(data.dashData)
            if(data.success){
                setDashdata(data.dashData)
                console.log(data.dashData)
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const getProfiledata = async ()=> {
        try {
            
            const{data} = await axios.get(backendUrl+'/api/doctor/profile',{headers:{Authorization:`Bearer ${dToken}`}})
            console.log(data)
            if(data.success){
                setProfiledata(data.profileData)
                console.log(data.profileData)
                toast.success(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const value = {
    dToken,setDtoken,
    backendUrl,
    appointment,setAppointment,
    getAppointments,
    completeAppointment,cancelAppointment,
    dashData,setDashdata,getDashdata,
    profileData,setProfiledata,getProfiledata

    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider