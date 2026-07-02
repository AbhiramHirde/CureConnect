import validator from "validator";
import bcrypt from "bcrypt";
import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import { v2 as Cloudinary } from "cloudinary";
import doctorModel from "../Models/DoctorModel.js";
import appointmentModel from "../Models/AppointmentModel.js";
import Razorpay from "razorpay";
// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Invalid Email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter a strong password",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new UserModel(userData);
    const user = await newUser.save();
    //_id
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    console.log(token);
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User Not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET
      );

      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid password",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API TO GET USERPROGILE

const getProfile = async (req, res) => {
  try {
    // Extract userId from the decoded token (which was set in authUser middleware)
    const userId = req.user?.id;

    console.log("Received userId:", userId);

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch user data from the database (excluding password)
    const userData = await UserModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      userData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//api to update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, phone, password, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || password || !phone || !dob || !gender) {
      return res.json({
        success: false,
        message: "Data Missing",
      });
    }
    await UserModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address,
      address: JSON.parse(address),
      dob,
      gender,
    });
    if (imageFile) {
      //upload image to cludinary
      const imageUpload = await Cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      await UserModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API TO BOK APPOINTMENT

const bookAppointment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { docId, slotTime, slotDate } = req.body;

    // Fetch doctor and user data
    const docData = await doctorModel.findById(docId).select("-password");
    const userData = await UserModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Debug logs
    console.log("userData:", userData);
    console.log("docData:", docData);

    if (!docData || !userData) {
      return res.json({
        success: false,
        message: "Invalid doctor or user",
      });
    }

    if (!docData.available) {
      return res.json({
        success: false,
        message: "Doctor Not Available",
      });
    }

    let slots_booked = docData.slots_booked || {};

    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({
        success: false,
        message: "Slot Not Available",
      });
    }

    slots_booked[slotDate] = slots_booked[slotDate] || [];
    slots_booked[slotDate].push(slotTime);

    // Prepare appointment data
    const appointmentData = {
      userId,
      docId,
      slotData: slotDate, // Ensure slotData is included
      slotTime,
      userData,
      doctorData: docData,
      amount: docData.fees,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Save updated slots in doctor model
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment booked",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//api to get user apppintments

const listAppointments = async (req, res) => {
  try {
    //const {userId} = req.body
    const userId = req.user?.id;
    const appointments = await appointmentModel.find({ userId });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//API TO CANCEL APPOINTMENT

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    // Find appointment
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify user
    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
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
//razor pay website link
//https://dashboard.razorpay.com/app/website-app-settings/api-keys

//API TO MAKE PAYMENT  OF APPOINTMENT
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
  try {
    // const appointmentId = req.user?.id;
   const { appointmentId } = req.body;
   console.log(appointmentId)
    const appointmentData = await appointmentModel.findById(appointmentId);
    console.log(appointmentData)
    console.log(!appointmentData.cancelled)
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    // creating option for razorpay
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.currency,
      receipt: appointmentId,
    };

    // creation of an order

    const order = await razorpayInstance.orders.create(options);
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//API TO VERIFY PAYMENT


const verifyRazorpay = async (req,res) => {
    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        console.log(orderInfo)
        if(orderInfo.status==='paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({
                success:true,
                message:"Payment successfull"
            })
        } else{
            res.json({
                success:false,
                message:"Payment failed"
            })
        }

    } catch (error) {
        console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
        
    }

}



export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay
};
