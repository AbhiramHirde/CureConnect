import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../Context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAlldoctors,changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAlldoctors();
    }
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="group border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer shadow-md transition-all duration-500 hover:bg-blue-400"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-56 h-40 object-cover transition-all duration-500 group-hover:opacity-80"
            />
            <div className="p-3">
              <p className="text-md font-semibold text-gray-800 group-hover:text-white">
                {item.name}
              </p>
              <p className="text-sm text-gray-600 group-hover:text-white">
                {item.speciality}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} readOnly />
                <p className="text-sm text-green-600 group-hover:text-white">
                  Available
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
