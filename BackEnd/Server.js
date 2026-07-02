import express from 'express'
import cors from 'cors'
import 'dotenv/config' 
import ConnectDb from './Config/MongoDb.js';
import ConnectCloudinary from './Config/Cloudinary.js';
import adminRouter from './Routes/AdminRoute.js';
import doctorRouter from './Routes/DoctorRoute.js';
import userRouter from './Routes/UserRoute.js';
//app config

const app = express();
const Port = process.env.PORT||4000;
ConnectDb()
ConnectCloudinary()
//middlewares

app.use(express.json())
app.use(cors())

//api end point

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
//localhost:4000/api/admin/add-doctor

app.get('/',(req,res)=> {
    res.send('will it  work')
})

app.listen(Port,()=> {
    console.log("it is working on port",Port)
})