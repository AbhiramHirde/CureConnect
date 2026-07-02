import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../Context/Appcontext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../Components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
const Appointments = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysofWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log("Doctor Info:", docInfo);
  };

  const getAvailableSlots = async () => {
    let slots = []; // Temporary array to store all slots
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeslots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}/${month}/${year}`;
        const slotTime = formattedTime;
        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeslots.push({
            Datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slots.push(timeslots);
    }

    setDocSlot(slots); // Update state once with accumulated slots
    console.log("Available Slots:", slots);
  };

  const bookAppointment = async () => {
    console.log("Token:", token);
    if (!token) {
      toast.warning("Login to book an appointment");
      return navigate("/login");
    }

    try {
      console.log("docSlot:", docSlot);
      console.log("slotIndex:", slotIndex);
      console.log(
        "Selected Slot:",
        docSlot[slotIndex] ? docSlot[slotIndex][0] : "No slot available"
      );

      // Validate selected slot
      if (!docSlot.length || !docSlot[slotIndex] || !docSlot[slotIndex][0]) {
        toast.error("No slots available. Please select a valid time slot.");
        return;
      }

      const slotData = docSlot[slotIndex][0]; // Extract the slot object
      let date = slotData.Datetime;

      // ✅ Ensure `Datetime` is a valid Date object
      if (!(date instanceof Date)) {
        date = new Date(date); // Convert it if it's a string
      }

      if (isNaN(date.getTime())) {
        console.error("Invalid date format:", date);
        toast.error("Invalid date format. Please try again.");
        return;
      }

      // ✅ Extracting and formatting date correctly
      let day = date.getDate();
      let month = date.getMonth() + 1; // Months are 0-based in JavaScript
      let year = date.getFullYear();

      const slotDate = `${day}/${month}/${year}`; // Correct format
      console.log("Booking Date:", slotDate); // ✅ Check output here

      // ✅ Ensure `slotTime` is set before sending
      if (!slotTime) {
        toast.warning("Please select a time slot.");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotData,
          slotTime,
          slotDate, // ✅ Include slotDate in the request
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Booking response:", data);

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      console.error("Error in bookAppointment:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log("Updated Slots:", docSlot);
  }, [docSlot]);

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-blue-400 w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* Doctor Name, Degree, and Speciality */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* About Doctor */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>

            {/* Appointment Fee */}
            <p className="text-gray-600 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
        {/* booking slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlot.length &&
              docSlot.map((item, index) => (
                <div
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-blue-400 text-white"
                      : "border border-gray-400"
                  }`}
                  key={index}
                >
                  {item.length > 0 && ( // Ensure item[0] is not undefined
                    <div onClick={() => setSlotIndex(index)}>
                      <p>{daysofWeek[item[0].Datetime.getDay()]}</p>
                      <p>{item[0].Datetime.getDate()}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlot.length &&
              docSlot[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-blue-400 text-white"
                      : "text-gray-400 border border-gray-400"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className="bg-blue-400 text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book Appointment
          </button>
        </div>
        {/* importing another component */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointments;
