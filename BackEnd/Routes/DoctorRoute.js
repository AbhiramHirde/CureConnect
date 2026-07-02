
import express from 'express'
import { appointmentsDoctor, doctorList, loginDoctor,appointmentComplete,appointmentCancel, doctorDashboard,doctorProfile,updateDoctorprofile } from '../Controller/DoctorController.js';
import authDoctor from '../Middleware/AuthDoctor.js';
const doctorRouter = express.Router();

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,updateDoctorprofile)

export default doctorRouter
