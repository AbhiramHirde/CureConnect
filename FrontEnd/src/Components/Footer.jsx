import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* left section */}
        <div>
            <img className='mb-5 w-40' src={assets.logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6 '>Book your appointments with ease and access quality healthcare from trusted professionals. Our platform connects you with experienced doctors, ensuring personalized care for you and your loved ones. Stay informed, manage your appointments effortlessly, and experience healthcare that prioritizes your well-being and convenience.
            </p>
        </div>




        {/* centre section */}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
            </ul>
        </div>




        {/* right section */}
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+91-212-456-7890</li>
                <li>greatstackdev@gmail.com</li>
            </ul>
        </div>
      </div>
      <div>
        {/* copyright text */}
        <hr />
        <p className='pu-5 text-sm text-center'>Copyright 2025@Prescripo - All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Footer
