import { ClerkProvider, useSignIn, SignInButton } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import Wrapper from "./components/Wrapper/Wrapper";
import LoginPage from "./components/LoginPage/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EditPage from "./pages/EditPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dark, neobrutalism, shadesOfPurple } from "@clerk/themes";
const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const App = () => (
  <ClerkProvider
  appearance={{
    baseTheme: [dark],
  }}
  publishableKey={clerkPublishableKey}>
    <Router>
      <Routes>
        <Route path="/" element={<a className="flex items-center justify-center min-h-screen bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300" href="/login">Click to login</a>}/>
        <Route path="/login" element={<Wrapper CurrentComponent={<LoginPage />} />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/edit/:id" element={<EditPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  </ClerkProvider>

);

export default App;