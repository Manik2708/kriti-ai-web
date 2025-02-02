import { ClerkProvider} from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Wrapper from "./components/Wrapper/Wrapper";
import LoginPage from "./components/LoginPage/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EditPage from "./pages/EditPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dark } from "@clerk/themes";
import AboutUs from "./pages/AbooutUs";
const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const App = () => (
  <ClerkProvider
  appearance={{
    baseTheme: [dark],
  }}
  publishableKey={clerkPublishableKey}>
    <Router>
      <Routes>
      <Route path="/" element={<Wrapper CurrentComponent={<LoginPage />} />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="/about" element={<AboutUs />} />
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