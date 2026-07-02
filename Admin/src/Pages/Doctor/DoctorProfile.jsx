import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../Context/DoctorContext";
import { AppContext } from "../../Context/AppContext";
import axios from 'axios'
import {toast} from 'react-toastify'
const DoctorProfile = () => {
  const { dToken, profileData, getProfiledata, setProfiledata } =
    useContext(DoctorContext);
  const { currency,backendUrl } = useContext(DoctorContext);
  const [isedit, setIsedit] = useState(false);

  const updateProfile = async ()=> {
    try {
        const updateData = {
            address:profileData.address,
            fees:profileData.fees,
            available:profileData.available,
        }

        const {data} = await axios.post(backendUrl+'/api/doctor/update-profile',updateData,{headers:{Authorization:`Bearer ${dToken}`}})
        console.log(data);
        if(data.success){
            toast.success(data.message)
            setIsedit(false)
            getProfiledata()
        } else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
        console.log(error)
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfiledata();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-5xl bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row gap-8">
          {/* Doctor Image */}
          <div className="flex justify-center items-start">
            <img
              src={profileData.image}
              alt="Doctor"
              className="w-40 h-40 md:w-52 md:h-52 object-cover rounded-full border-4 border-indigo-500"
            />
          </div>

          {/* Doctor Info */}
          <div className="flex-1 space-y-4">
            {/* Name */}
            {isedit ? (
              <input
                type="text"
                className="text-2xl font-bold text-gray-800 border border-gray-300 rounded px-2 py-1 w-full"
                value={profileData.name}
                onChange={(e) =>
                  setProfiledata((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">
                {profileData.name}
              </h2>
            )}

            {/* Degree & Speciality */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {isedit ? (
                <>
                  <input
                    type="text"
                    placeholder="Degree"
                    value={profileData.degree}
                    onChange={(e) =>
                      setProfiledata((prev) => ({
                        ...prev,
                        degree: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Speciality"
                    value={profileData.speciality}
                    onChange={(e) =>
                      setProfiledata((prev) => ({
                        ...prev,
                        speciality: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                </>
              ) : (
                <p className="text-gray-600 text-lg">
                  {profileData.degree} - {profileData.speciality}
                </p>
              )}

              {isedit ? (
                <input
                  type="number"
                  value={profileData.experience}
                  onChange={(e) =>
                    setProfiledata((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {profileData.experience} yrs experience
                </button>
              )}
            </div>

            {/* About */}
            <div>
              <p className="text-sm font-semibold text-gray-700">About:</p>
              {isedit ? (
                <textarea
                  rows="3"
                  value={profileData.about}
                  onChange={(e) =>
                    setProfiledata((prev) => ({
                      ...prev,
                      about: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <p className="text-gray-600">{profileData.about}</p>
              )}
            </div>

            {/* Fees */}
            <p className="text-gray-700 font-medium">
              Appointment fee:{" "}
              <span className="text-indigo-600 font-semibold">
                {currency}
                {isedit ? (
                  <input
                    type="number"
                    className="ml-2 border border-gray-300 rounded px-2 py-1"
                    onChange={(e) =>
                      setProfiledata((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>

            {/* Address */}
            <div>
              <p className="text-sm font-semibold text-gray-700">Address:</p>
              {isedit ? (
                <>
                  <input
                    type="text"
                    placeholder="Line 1"
                    className="mb-2 border border-gray-300 rounded px-2 py-1 w-full"
                    onChange={(e) =>
                      setProfiledata((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          line1: e.target.value,
                        },
                      }))
                    }
                    value={profileData?.address?.line1}
                  />
                  <input
                    type="text"
                    placeholder="Line 2"
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    onChange={(e) =>
                      setProfiledata((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          line2: e.target.value,
                        },
                      }))
                    }
                    value={profileData?.address?.line2}
                  />
                </>
              ) : (
                <>
                  <p className="text-gray-600">{profileData?.address?.line1}</p>
                  <p className="text-gray-600">{profileData?.address?.line2}</p>
                </>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                className="accent-indigo-500 w-4 h-4"
                checked={profileData.available}
                disabled={!isedit}
                onChange={(e) =>
                  setProfiledata((prev) => ({
                    ...prev,
                    available: e.target.checked,
                  }))
                }
              />
              <label htmlFor="available" className="text-gray-700">
                Available
              </label>
            </div>

            {/* Edit/Save Button */}
            {isedit ? (
              <button
                onClick={() => updateProfile()}
                className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsedit(true)}
                className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
