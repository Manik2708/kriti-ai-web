import React from 'react';

export default function OTPPage() {
  return (
    <div className="w-[90%] h-[90%] p-8 flex flex-col pt-20">
      <h1 className="text-3xl md:text-5xl ml-[5%] md:ml-[10%] font-['Montserrat'] font-semibold text-[#f6f2f2] mb-2">
        Email Verification
      </h1>
      <p className="text-1xl text-gray-100 mt-6 ml-10 font-inter">A code has been sent to your Email address:</p>
      <p className="text-1.5xl text-[#4f72b7] ml-10 font-inter" >emailid@gmail.com</p>
      
      <input
        type="text"
        placeholder="Enter OTP to verify"
        className="mt-10 w-[80%] h-8 text-lg bg-gray-800 border-b border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 self-center px-2 text-white"
      />

      <button
        className="font-inter w-1/2 h-9 text-lg font-semibold text-[#38bdf8] bg-[#2d2351] rounded-full self-center mt-9 shadow-xl hover:bg-[#3a2c6a] hover:scale-105 transition-transform duration-150 ease-out border-0"
      >
        Verify
      </button>

      <div className="font-inter flex justify-center items-center gap-2 text-gray-400 font-semibold mt-10">
        <p>Didn't get the OTP?</p>
        <a
          href="###"
          className="text-lg text-blue-400 hover:scale-110 hover:text-purple-500 transition-transform duration-150 ease-out"
        >
          Resend
        </a>
      </div>
    </div>
  );
}