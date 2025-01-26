import React, { useState } from "react";
import {
  SignedOut,
  useAuth,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { isSignedIn  } = useAuth();
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false); // State to toggle SignIn and SignUp

  if (isSignedIn) {
    navigate("/dashboard");
  }

  // Function to send user data to the backend


  return (
    <div className="w-full md:w-[90%] h-[90%] p-4 md:p-8 flex flex-col">
      <SignedOut>
        <div className="w-full max-w-sm">
          {/* Conditionally render SignIn or SignUp based on state */}
          {showSignUp ? (
            <SignUp
              appearance={{
                elements: {
                  footer: "bg-transparent !important",
                  card: "bg-gradient-to-br from-[#171124] to-[#1c142b] text-white border-none shadow-md",
                  headerTitle: "text-white",
                  headerSubtitle: "text-gray-300",
                  socialButtonsBlockButtonText: "text-white",
                  formFieldInput: "bg-transparent text-white border-gray-500",
                  formFieldLabel: "text-white",
                  formButtonPrimary: "bg-[#3a2c6a] hover:bg-[#3a2c6a] text-white",
                  footerActionText: "text-gray-300",
                  footerActionLink: "text-[#38bdf8] hover:underline",
                },
              }}
              afterSignOutUrl={() => console.log("Logged Out")} // Navigate to login after sign up
              afterSignUpUrl={() =>{
                navigate("/dashboard");
              }} // Navigate to dashboard after sign up
            />
          ) : (
            <SignIn
              appearance={{
                elements: {
                  footer: "bg-transparent !important",
                  card: "bg-gradient-to-br from-[#171124] to-[#1c142b] text-white border-none shadow-md",
                  headerTitle: "text-white",
                  headerSubtitle: "text-gray-300",
                  socialButtonsBlockButtonText: "text-white",
                  formFieldInput: "bg-transparent text-white border-gray-500",
                  formFieldLabel: "text-white",
                  formButtonPrimary: "bg-[#3a2c6a] hover:bg-[#3a2c6a] text-white",
                  footerActionText: "text-gray-300",
                  footerActionLink: "text-[#38bdf8] hover:underline",
                },
              }}
              afterSignOutUrl={() => console.log("Logged Out")} // Navigate to login after sign up
              afterSignInUrl="/dashboard" // Navigate to dashboard after login
            />
          )}

          {/* Toggle SignIn and SignUp */}
          <div className="text-center mt-4">
            {showSignUp ? (
              <p className="text-gray-300">
                Already have an account?{" "}
                <span
                  className="text-[#38bdf8] cursor-pointer hover:underline"
                  onClick={() => setShowSignUp(false)}
                >
                  Sign In
                </span>
              </p>
            ) : (
              <p className="text-gray-300">
                Don’t have an account?{" "}
                <span
                  className="text-[#38bdf8] cursor-pointer hover:underline"
                  onClick={() => setShowSignUp(true)}
                >
                  Sign Up
                </span>
              </p>
            )}
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
