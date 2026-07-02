import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>
            <h3 className='font-bold'>Who We Are</h3>
            Prescripto is a trusted healthcare platform committed to connecting patients with top medical professionals.  
            We provide seamless appointment booking, ensuring access to quality healthcare at your convenience.  
            Our goal is to make medical consultations efficient, accessible, and stress-free for everyone.
          </p>

          <p>
            <h3 className='font-bold'>Our Mission</h3>
            We aim to bridge the gap between patients and doctors through technology-driven healthcare solutions.  
            By offering a user-friendly interface, we simplify the process of finding and consulting experienced specialists.  
            At Prescripto, we prioritize patient well-being by making healthcare services more transparent and reliable.
          </p>

          <p>
            <h3 className='font-bold'>Why Choose Us</h3>
            Our platform features verified doctors with diverse specializations, ensuring expert medical advice.  
            With secure and hassle-free booking, we save you time while prioritizing your health needs.  
            At Prescripto, we believe in innovation, reliability, and a commitment to better healthcare experiences.
          </p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      {/* Key Features Section */}
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-sm hover:transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICIENCY:</b>
          <p>Ensuring quick and seamless appointment booking with top medical professionals.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-sm hover:transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIENCE:</b>
          <p>Access trusted healthcare services anytime, anywhere, with just a few clicks.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-sm hover:transition-all duration-300 text-gray-600 cursor-pointer bg-blue-50'>
          <b>PERSONALIZATION</b>
          <p>Tailored healthcare experiences based on your unique needs and preferences.</p>
        </div>
      </div>
    </div>
  )
}

export default About
