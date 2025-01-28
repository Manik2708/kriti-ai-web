import { ClerkProvider, useSignIn, SignInButton } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import Wrapper from "./components/Wrapper/Wrapper";
import LoginPage from "./components/LoginPage/LoginPage";
import SignUpPage from './components/SignUp page/SignUp';
import OTPPage from './components/OtpPage/OTPPage';
import DashboardPage from "./pages/DashboardPage";
import EditPage from "./pages/EditPage";


const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const App = () => (
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <Router>
      <Routes>
        <Route path="/" element={<a className="flex items-center justify-center min-h-screen bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300" href="/login">Click to login</a>}/>
        <Route path="/login" element={<Wrapper CurrentComponent={<LoginPage />} />} />
        <Route path="/signup/*" element={<Wrapper CurrentComponent={<SignUpPage />} />} />
        <Route path="/otp/*" element={<Wrapper CurrentComponent={<OTPPage />} />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/edit/:id" element={<EditPage />} />
      </Routes>
    </Router>
  </ClerkProvider>

);

export default App;