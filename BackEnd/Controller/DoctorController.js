import bcrypt from "bcrypt";
import doctorModel from "../Models/DoctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../Models/AppointmentModel.js";
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({
      success: true,
      message: "Availability Updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({
      success: true,
      doctors,
    });
    console.log(doctors);
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API FOR DOCTOR LOGIN

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });

    // ✅ STOP execution if doctor not found
    if (!doctor) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { id: doctor._id },
      process.env.JWT_SECRET
    );

    return res.json({
      success: true,
      token,
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


//appopintments of a specific doctor

const appointmentsDoctor = async (req, res) => {
  try {

    const {docId} = req.body
    const appointments = await appointmentModel.find({docId})
    console.log(appointments)
    res.json({
        success:true,
        appointments
    })

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API TO MARK APPOINTMENT COMPLETD

const appointmentComplete = async (req,res)=> {
    try {

        const {docId,appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            res.json({
                success:true,
                message:"Appointment Completed"
            })
        }
        else{
            res.json({
                success:false,
                message:"Mark Failed"
            })
        }

        
    } catch (error) {
        console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
    }
}



//API TO CANCEL APPOINTMENT


const appointmentCancel = async (req,res)=> {
    try {

        const {docId,appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            res.json({
                success:true,
                message:"Appointment Cancelled"
            })
        }
        else{
            res.json({
                success:false,
                message:"Cancellation Failed"
            })
        }

        
    } catch (error) {
        console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
    }
}

//API TO GET DASHBOARD DATA FOR DOCTOR PANEL


const doctorDashboard = async (req,res)=> {

    try {

        const {docId} = req.body
        const appointments = await appointmentModel.find({docId})

        let earnings = 0
        appointments.map((item)=> {
            if(item.isCompleted || item.payment){
                earnings+=item.amount
            }
        })
        let patients = []
        appointments.map((item)=> {
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        res.json({
            success:true,
            dashData
        })
        
    } catch (error) {

    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
        
    }

}

// API TO GET DOCTOR PROFILE FOR DOCTOR PANEL

const doctorProfile = async (req,res)=> {

    try {

        const {docId} = req.body
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({
            success:true,
            profileData
        })

        
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
          });
    }

}



//API TO UPDATE PROFILE DATA FROM DOCTOR MODEL

 const updateDoctorprofile = async (req,res)=> {
    try {
        const {docId,fees,address,available} = req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({
            success:true,
            message:"Profle updated"
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
          });
    }

 }



export { changeAvailability, doctorList, loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,doctorProfile,updateDoctorprofile };
