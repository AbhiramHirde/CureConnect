import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../Models/DoctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../Models/AppointmentModel.js';
import UserModel from '../Models/UserModel.js';

const AddDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        console.log({ name, email, password, speciality, degree, experience, about, fees, address }, imageFile);
        console.log(imageFile)

        // Checking for required fields
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees) {
            return res.json({ success: false, message: "Insufficient info provided" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid Email" });
        }

        // Validate password length
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Ensure image file exists
        if (!imageFile) {
            return res.json({ success: false, message: "Image is required" });
        }

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: typeof address === "string" ? JSON.parse(address) : address,
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin Login API
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.json({ success: true, token });

        } else {
            res.json({ success: false, message: "Invalid Email or password" });
        }
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


//api to get all doctors list for admin panel

const allDoctors = async (req,res) => {
        try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({
            success:true,
            doctors
        })


            
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
}

//API TO GET ALL APPOINTMENTS

const appointmentsAdmin = async (req,res) => {
try {

    const appointments = await appointmentModel.find({})
    console.log(appointments)
    res.json({
        success:true,
        appointments
    })
    
    }    catch (error) {
    console.log(error);
            res.json({ success: false, message: error.message });
    }
}


//cancel appointment
const Appointmentcancel = async (req, res) => {
    try {
      const {appointmentId } = req.body;
  
      // Find appointment
      const appointmentData = await appointmentModel.findById(appointmentId);
      if (!appointmentData) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }
  
    
     
  
      // Cancel the appointment
      const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { cancelled: true },
        { new: true }
      );
  
      console.log("Updated Appointment:", updatedAppointment);
  
      // Release the slot
      const { docId, slotData, slotTime } = appointmentData;
      const doctorData = await doctorModel.findById(docId);
      if (doctorData) {
        let slots_booked = doctorData.slots_booked;
        slots_booked[slotData] = slots_booked[slotData].filter(
          (e) => e !== slotTime
        );
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
      }
  
      res.json({
        success: true,
        message: "Appointment cancelled",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



  //API TO GET DASHBOARD DATA FOR ADMIN PANRL

  const adminDashboard = async (req,res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await UserModel.find({})
        const appointments = await appointmentModel.find({})
        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        res.json({
            success:true,
            dashData
        })
        
    } catch (error) {
        console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }

  }


export { AddDoctor, loginAdmin,allDoctors,appointmentsAdmin,Appointmentcancel,adminDashboard };
