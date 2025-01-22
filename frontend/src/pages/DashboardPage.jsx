import React, { useState } from 'react';
import { useAuth, RedirectToSignIn, SignedIn, UserButton } from '@clerk/clerk-react';
import AccountIcon from '../assets/accoutIcon.svg';
import AddCircleIcon from '../assets/addIcon.svg';
import CloseIcon from '../assets/addIcon.svg';
import LogoutIcon from '../assets/logOut.svg';
import WebsiteDetails from '../components/DashboardComponents/WebsiteDetails';
import {useNavigate} from 'react-router-dom';

const Dashboard = () => {
const navigate = useNavigate();
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const { isSignedIn } = useAuth(); // Check if user is signed in

  const handleAccountClick = () => {
    setIsAccountVisible(true);
  };

  const handleCloseAccount = () => {
    setIsAccountVisible(false);
  };

  const sites = [
    { name: 'Site1', url: 'www.site1.com' },
    { name: 'Site2', url: 'www.site2.com' },
    {name: 'site3', url : ''}
  ];

  // If the user is not signed in, redirect to login
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="bg-gradient-to-br from-[#171124] to-[#1c142b] text-text-color min-h-screen overflow-x-hidden relative">
    {/* Navigation */}
    <nav className="fixed top-0 left-0 w-full h-16 md:h-20 flex justify-center items-center bg-gradient-to-br from-[#171124] to-[#1c142b] border-b border-gray-500/60 z-50">
      <div className="w-11/12 max-w-7xl flex justify-between items-center px-4">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-text-color">Web</h1>
          <h1 className="text-2xl md:text-3xl font-bold text-text-color-2">Weaver</h1>
        </div>
        {/* Navigation Items */}
        <ul className="flex items-center space-x-4 md:space-x-8">
          <li className="hidden sm:block hover:underline">
            <a href="#" className="text-base md:text-lg text-text-color">About Us</a>
          </li>
          <li className="hidden sm:block hover:underline">
            <a href="#" className="text-base md:text-lg text-text-color">Contact</a>
          </li>
          <li className="cursor-pointer">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </li>
        </ul>
      </div>
    </nav>

    {/* Mobile Menu (Hamburger) */}
    <div className="sm:hidden fixed bottom-0 left-0 w-full h-16 bg-gradient-to-br from-[#171124] to-[#1c142b] border-t border-gray-500/60 flex justify-around items-center z-50">
      <a href="#" className="text-text-color text-sm">About Us</a>
      <a href="#" className="text-text-color text-sm">Contact</a>
    </div>

    {/* Dashboard Section */}
    <div className="flex justify-center w-full pt-24 md:pt-28 px-4">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-text-color">Dashboard</h1>
        <p className="text-sm md:text-base text-text-color-2 mt-2">Manage all your projects at one place</p>
      </div>
    </div>

    {/* Sites List */}
    <div className="flex justify-center w-full bg-gradient-to-br from-[#171124] to-[#1c142b] mt-8 px-4">
      <div className="w-full max-w-7xl flex flex-col space-y-6">
        {sites.map((site, index) => (
          <WebsiteDetails key={index} name={site.name} url={site.url} />
        ))}
      </div>
    </div>

    {/* Add Button */}
    <div className="fixed bottom-20 sm:bottom-8 right-8 z-40">
      <button 
        onClick={() => navigate("/new")}
        className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full hover:scale-110 transition-transform duration-200"
      >
        <img src={AddCircleIcon} alt="Add" className="w-full h-full" />
      </button>
    </div>

    {/* Account Modal */}
    {isAccountVisible && (
      <div className="fixed top-16 md:top-20 right-0 w-64 h-auto bg-[#3991e33d] backdrop-blur-lg rounded-bl-lg shadow-lg transition-all duration-200">
        <div className="flex flex-col">
          <div className="flex justify-end p-4 cursor-pointer" onClick={handleCloseAccount}>
            <img src={CloseIcon} alt="Close" className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <button className="flex items-center gap-4 px-5 py-4 hover:bg-gray-500/20 transition-colors duration-200">
            <img src={LogoutIcon} alt="Logout" className="w-6 h-6 md:w-8 md:h-8" />
            <span className="text-base md:text-lg text-text-color">Logout</span>
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

export default Dashboard;
