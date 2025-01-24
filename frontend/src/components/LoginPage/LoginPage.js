import React, { useState, useEffect } from "react";
// import './style.css'
import { useAuth, ClerkProvider, useSignIn, SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../AlertBox/AlertBox";

export default function LoginPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isLoggedIn = useAuth();

    useEffect(()=>{
      if (isLoggedIn) {
        navigate('/dashboard');
      }
    },[])

  const handleEmailSubmit = async () => {
    //Checking if all fields are filled correctly or not......
    if (!(email && password)) {
      setMessage("Please fill all fields");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Invalid Email");
      return;
    }

    //Code for submit button goes here......
  };

  return (
    <div className="w-full md:w-[90%] h-[90%] p-4 md:p-8 flex flex-col">
      {message && <AlertBox message={message} type="error" />}

      <h1 className="text-3xl pt-2 md:text-3xl ml-[5%] md:ml-[10%] font-['Montserrat'] font-semibold text-[#f6f2f2] mb-2">
        Log In
      </h1>

      <div className="flex gap-2 ml-[5%] md:ml-[10%] mb-4">
        <h3 className="font-['Inter'] font-normal text-[#f6f2f2] text-sm md:text-base">
          New user?
        </h3>
        <h3 className="font-['Inter'] font-normal text-sm md:text-base">
          <span
            className="text-[#38bdf8] cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            sign up
          </span>
        </h3>
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-6 md:mt-10 w-[90%] md:w-4/5 h-8 text-base md:text-lg bg-transparent border-b border-gray-500 self-center font-['Inter'] font-normal text-white placeholder-gray-400 focus:outline-none focus:border-[#5271ff]"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-6 md:mt-8 w-[90%] md:w-4/5 h-8 text-base md:text-lg bg-transparent border-b border-gray-500 self-center font-['Inter'] font-normal text-white placeholder-gray-400 focus:outline-none focus:border-[#5271ff]"
      />

      <button
        onClick={handleEmailSubmit}
        className="w-[70%] md:w-1/2 h-10 text-base font-['Inter'] font-semibold text-[#38bdf8] bg-[#2d2351] rounded-full self-center mt-6 md:mt-9 shadow-xl hover:bg-[#3a2c6a] hover:scale-105 transition-transform duration-150 ease-out border-0"
      >
        Log in &nbsp; &#9654;
      </button>

      <div className="flex justify-center mt-6 md:mt-8 items-center w-full">
        <div className="w-[40%] border-b border-gray-500"></div>
        <p className="text-xs md:text-sm text-gray-500 px-2 font-['Inter']">
          or
        </p>
        <div className="w-[40%] border-b border-gray-500"></div>
      </div>
      <SignedOut forceRedirectUrl={'/dashboard'}>
        <SignInButton mode="modal">
          <button
            className="flex gap-3 md:gap-5 bg-[#2d2351] px-6 md:px-8 py-2 rounded-full mt-6 md:mt-8 items-center self-center shadow-xl transition-transform duration-150 ease-out hover:bg-[#3a2c6a] hover:scale-105 border-0 text-[#38bdf8] font-semibold"
          ><img
              src="images/$RVYYL8V.png"
              alt="Google logo"
              className="h-6 w-6 md:h-8 md:w-8"
            />
            <p className="text-sm md:text-base font-['Inter'] font-semibold text-[#38bdf8]">
              Login with Google
            </p>
          </button>
        </SignInButton>
      </SignedOut>

    </div>
  );
}
