import express from 'express'
import { AddDoctor,allDoctors,loginAdmin,appointmentsAdmin, Appointmentcancel, adminDashboard } from '../Controller/AdminController.js'
import upload from '../Middleware/multur.js'
import authAdmin from '../Middleware/AuthAdmin.js'
import {changeAvailability} from '../Controller/DoctorController.js'
const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),AddDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,Appointmentcancel)
adminRouter.get('/dashboard-data',authAdmin,adminDashboard)

export default adminRouter