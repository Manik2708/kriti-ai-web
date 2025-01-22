import React, { useState } from 'react';
import { useAuth, RedirectToSignIn, SignedIn, UserButton } from '@clerk/clerk-react';
import LogoutIcon from '../assets/logOut.svg';
import CloseIcon from '../assets/addIcon.svg';

export default function CreatePage({name, url, messagesArray }) {
    const [messages, setMessages] = useState(messagesArray);
    const [inputMessage, setInputMessage] = useState('');
    const [isAccountVisible, setIsAccountVisible] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isSignedIn } = useAuth();

    const handleAccountClick = () => setIsAccountVisible(true);
    const handleCloseAccount = () => setIsAccountVisible(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    const enterMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() !== '') {
            setMessages([...messages, [1, inputMessage]]);
            setInputMessage('');
        }
    };

    return (
        <div className="bg-[#13131f] min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full h-16 md:h-20 flex justify-center items-center bg-primary-color border-b border-gray-500/60 z-50">
                <div className="w-11/12 flex justify-between items-center px-4">
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

            {/* Mobile Toggle Button */}
            <button 
                className="fixed bottom-4 right-4 md:hidden z-50 bg-[#2d2351] p-3 rounded-full text-white"
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? '✕' : '👁️'}
            </button>

            <main className="pt-16 md:pt-20 h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">
                <div className="h-full grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 p-4">
                    {/* Chat Section */}
                    <div className="flex flex-col h-full relative order-2 md:order-1">
                        <div className="flex-grow overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-track-[#1c1c28] scrollbar-thumb-[#2a2a3d]">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`w-[100%] flex ${
                                        message[0] 
                                            ? "justify-end" 
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`rounded-lg p-3 md:p-4 text-white mb-3 md:mb-4 min-h-[40px] inline-block max-w-[85%] ${
                                            message[0] 
                                                ? "bg-[#1e1e2d] text-right" 
                                                : "bg-[#2d2351] text-left"
                                        }`}
                                    >
                                        {message[1]}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sticky bottom-0 bg-[#13131f] pt-2 md:pt-4">
                            <form
                                className="bg-[#1e1e2d] rounded-xl flex items-center gap-2"
                                onSubmit={enterMessage}
                            >
                                <textarea
                                    className="bg-transparent p-3 md:p-4 h-[45px] text-white text-sm md:text-base flex-grow resize-none placeholder-gray-500"
                                    placeholder="Make a website that..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                ></textarea>
                                <button
                                    type="submit"
                                    className="p-3 md:p-4 text-white hover:text-blue-500 transition-colors duration-200 flex items-center"
                                >
                                    <span>▶</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className={`bg-[#1e1e2d] rounded-lg overflow-hidden order-1 md:order-2 
                        ${isSidebarOpen ? 'fixed inset-0 z-40 m-4' : 'hidden md:block'}`}>
                        <div className="bg-[#1c1c28] p-3 flex gap-2 overflow-x-auto">
                            <div className="bg-[#2a2a3d] px-3 md:px-4 py-2 rounded text-white text-xs md:text-sm flex items-center gap-2 whitespace-nowrap">
                                {name}
                                <span className="text-gray-500 cursor-pointer text-lg md:text-xl leading-none">×</span>
                            </div>
                            <div className="bg-[#2a2a3d] px-3 md:px-4 py-2 rounded text-white text-xs md:text-sm flex items-center gap-2 whitespace-nowrap">
                                View-source: {name}
                                <span className="text-gray-500 cursor-pointer text-lg md:text-xl leading-none">×</span>
                            </div>
                        </div>
                        <div className="m-2 p-2 bg-[#13131f] rounded text-gray-500 text-xs md:text-sm">
                            {url ? url : "Not deployed yet"}
                        </div>
                        <div className="h-[calc(100%-100px)] bg-[#2a2a3d]"></div>
                    </div>
                </div>
            </main>

            {/* Mobile Navigation */}
            <div className="sm:hidden fixed bottom-0 left-0 w-full h-16 bg-primary-color border-t border-gray-500/60 flex justify-around items-center z-30">
                <a href="#" className="text-text-color text-sm">About Us</a>
                <a href="#" className="text-text-color text-sm">Contact</a>
            </div>

            {/* Account Modal */}
            {isAccountVisible && (
                <div className="fixed top-16 md:top-20 right-0 w-64 h-auto bg-[#3991e33d] backdrop-blur-lg rounded-bl-lg shadow-lg transition-all duration-200">
                    <div className="flex justify-end p-4 cursor-pointer" onClick={handleCloseAccount}>
                        <img src={CloseIcon} alt="Close" className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-500/20 transition-colors duration-200">
                        <img src={LogoutIcon} alt="Logout" className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-base md:text-lg text-text-color">Logout</span>
                    </div>
                </div>
            )}
        </div>
    );
}