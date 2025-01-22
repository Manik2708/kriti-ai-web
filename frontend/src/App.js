import { ClerkProvider, useSignIn, SignInButton } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Wrapper from "./components/Wrapper/Wrapper";
import LoginPage from "./components/LoginPage/LoginPage";
import SignUpPage from './components/SignUp page/SignUp';
import OTPPage from './components/OtpPage/OTPPage';
import DashboardPage from "./pages/DashboardPage";
import NewPage from "./pages/NewPage"


const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const App = () => (
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <Router>
      <Routes>
        <Route path="/login" element={<Wrapper CurrentComponent={<LoginPage />} />} />
        <Route path="/signup/*" element={<Wrapper CurrentComponent={<SignUpPage />} />} />
        <Route path="/otp/*" element={<Wrapper CurrentComponent={<OTPPage />} />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/new" element={<NewPage messagesArray={[[0,'Welcome, how can I help you?']]} url = '' name = 'mysite'/>}/>
      </Routes>
    </Router>
  </ClerkProvider>

);

export default App;