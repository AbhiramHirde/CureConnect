import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
// import { doctors } from "../assets/assets_frontend/assets"; 

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctorsData, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state
  const[token,setToken] = useState((localStorage.getItem('token')?localStorage.getItem('token'):false))
  const[userData,setUserdata] = useState(false)



  const getDoctorsData = async () => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
        console.log(data);
        if (data.success) {
            setDoctors(data.doctors);
        } else {
            toast.error("Failed to fetch doctors data.");
        }
    } catch (error) {
        console.log(error);
        toast.error("Error fetching doctors data.");
    } finally {
        setLoading(false);  // Set loading to false when data fetch completes
    }
  }

const loadUserprofiledata = async () => {
    try {

      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        
    });
    if(data.success){
      setUserdata(data.userData)
    } else{
      
      toast.error(data.message)
    }
      
    } catch (error) {
      console.log(error);
      toast.error("Error fetching doctors data.");
    }
}
  // const[token,setToken] = useState('')
  const value = {
    doctors: doctorsData, getDoctorsData,
    currencySymbol,
    token,setToken,
    backendUrl,userData,
    setUserdata,loadUserprofiledata
  };
  useEffect(()=> {
    if(token){
      loadUserprofiledata()
    } else{
      setUserdata(false)
    }

  },[token])



  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (!loading && doctorsData.length === 0) {
      toast.error("No doctors data available.");
    }
  }, [doctorsData, loading]);  // Include 'loading' as dependency

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
