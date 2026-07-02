import React, { useContext, useState } from 'react'
// import { assets } from '../assets/assets_frontend/assets'
import { AppContext } from '../Context/Appcontext';
import { assets } from '../assets/assets_frontend/assets';
import axios from 'axios';
import {toast} from 'react-toastify'
const MyProfile = () => {

  // const[userData,setUserdata] = useState({
  //   name:"Edward Vincent",
  //   image:assets.profile_pic,
  //   email:"richardhames@gmail.com",
  //   phone:'+1 123 456 789',
  //   address:{
  //     line1:"57th cross Richmond",
  //     line2:"Circle,Church Road,London"
  //   },
  //   gender:"Male",
  //   dob:'2000-01-20'
  // })



// DYNAMIC DATA IS ADDED




const {userData,setUserdata,token,backendUrl,loadUserprofiledata} = useContext(AppContext)

const[isEdit,setIsEdit] = useState(true);
const[image,setImage] = useState(false)


const updateuserprofileData = async () => {
  try {
    // Ensure userData is complete
    if (!userData.name || !userData.phone || !userData.dob) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("phone", userData.phone);
    formData.append("address", JSON.stringify(userData.address || {}));
    formData.append("gender", userData.gender || "Male");
    formData.append("dob", userData.dob || "2000-01-01");

    if (image) {
      formData.append("image", image);
    }

    console.log("Final FormData:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]); // Ensure values are being added correctly
    }

    const { data } = await axios.post(`${backendUrl}/api/user/update`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.success) {
      toast.success(data.message);
      await loadUserprofiledata(); // Reload updated data
      setIsEdit(false);
      setImage(false);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};



  return userData &&  (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {
        isEdit
        ?
        <label htmlFor='image'>
          <div className='inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image):userData.image} alt="" />
            <img className='w-10 absolute bottom-12 right-12' src={image ? '':assets.upload_icon} alt="" />
          </div>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden />
        </label>
        :
        <img className='w-36 rounded' src={userData.image} alt="" />
      }
      
      {
        isEdit
        ?
        <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name} onChange={e=>setUserdata(prev=>({...prev,name:e.target.value}))} />
        :
        <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      }
      <hr className='bg-zinc-400 h-[1px] border-none'/>
      <div>
        <p className='text-neutral-500 underline my-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id :</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone</p>
          {
             isEdit
             ?
             <input className='bg-gray-100 max-w-52 ' type="text" value={userData.phone} onChange={e=>setUserdata(prev=>({...prev,phone:e.target.value}))} />
             :
             <p className='text-blue-400'>{userData.phone}</p>
          }
          <p className='font-medium'>Address</p>
          {
            isEdit
            ?
            <p>
              <input className='bg-gray-50' onChange={(e)=>setUserdata(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))}value={userData.address.line1} type="text" />
              <br />
              <input className='bg-gray-50' onChange={(e)=>setUserdata(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))}value={userData.address.line2} type="text" />
            </p>
            :
            <p className='text-gray-500'>
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          }
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline my-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {
             isEdit
             ? <select className='max-w-20 bg-gray-100' onChange={(e)=>setUserdata(prev => ({...prev,gender:e.target.value}))} value={userData.gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
             </select>
             :<p className='text-gray-400'>{userData.gender}</p>
          }
          <p className='font-medium'>Birthday:</p>
          {
            isEdit? <input className='max-w-28 bg-gray-100' type='date' onChange={(e)=>setUserdata(prev=>({...prev,dob:e.target.value}))} value={userData.dob}/>
            : <p className='text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>
      <div className='my-10'>
            {
              isEdit ? <button className='border border-blue-400 px-8 py-2 rounded-full hover:text-white hover:bg-blue-400 transition-all' onClick={updateuserprofileData}>Save Information</button>
              : <button className='border border-blue-400 px-8 py-2 rounded-full hover:text-white hover:bg-blue-400 transition-all' onClick={()=>setIsEdit(true)}> Edit</button>
            }
      </div>
    </div>
  )
}

export default MyProfile
