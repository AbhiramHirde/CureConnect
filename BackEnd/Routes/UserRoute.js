import express from 'express'
import { registerUser,loginUser, getProfile,updateProfile,bookAppointment, listAppointments,cancelAppointment,paymentRazorpay, verifyRazorpay } from '../Controller/UserController.js'
import authUser from '../Middleware/AuthUser.js'
import upload from '../Middleware/multur.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointments)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-Razorpay',authUser,paymentRazorpay)
userRouter.post('/verify-razorpay',authUser,verifyRazorpay)
export default userRouter