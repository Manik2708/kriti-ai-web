import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";

export default function AboutUs() {
    return (
        <>
        <nav className="fixed top-0 left-0 w-full h-11 md:h-16 flex justify-center items-center bg-gradient-to-br from-[#171124] to-[#1c142b] border-b border-gray-500/60 z-50">
        <div className="w-full  flex justify-between items-center px-4">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-text-color">
              IITG
            </h1>
            <h1 className="text-2xl md:text-3xl font-bold text-text-color-2">
              WebPro
            </h1>
          </div>
          <ul className="flex items-center space-x-4 md:space-x-8">
            <li className="hidden sm:block hover:underline">
              <Link to="/about" className="text-base md:text-lg text-text-color">
                About Us
              </Link>
            </li>
            <li className="cursor-pointer">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </li>
          </ul>
        </div>
      </nav>

      <div className="min-h-screen bg-gradient-to-br from-[#171124] to-[#1c142b] pt-[6%] text-white px-6 md:px-16 py-12">
        {/* About Us Section */}
        <section className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-['Montserrat'] font-semibold text-white">About Us</h1>
          <p className="mt-4 text-lg font-['Inter'] text-gray-300">
            Welcome to <span className="font-semibold text-white">IITGWebPro</span>, an AI-powered website generator that allows you to create, design, and edit websites effortlessly. Whether you're a business owner, designer, or developer, our platform provides an intuitive and dynamic environment to bring your ideas to life—without writing a single line of code.
          </p>
        </section>
  
        {/* Our Mission Section */}
        <section className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-['Montserrat'] font-semibold text-white">Our Mission</h2>
          <p className="mt-4 text-lg font-['Inter'] text-gray-300">
            At <span className="font-semibold text-white">IITGWebPro</span>, we strive to make website creation as simple and flexible as possible. Our goal is to empower users with an intelligent tool that enables them to <span className="font-bold text-blue-400">build, customize, and edit</span> professional-grade websites in real time, making web development more accessible and efficient than ever before.
          </p>
        </section>
  
        {/* Why Choose Us Section */}
        <section className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-['Montserrat'] font-semibold text-white">Why Choose IITGWebPro?</h2>
          <ul className="mt-4 space-y-3 text-lg font-['Inter'] text-gray-300">
            <li><span className="text-blue-400 font-semibold">AI-Driven Website Creation</span> – Get a fully structured website generated in seconds based on your needs.</li>
            <li><span className="text-blue-400 font-semibold">Real-Time Editing & Customization</span> – Modify every aspect of your website with an easy-to-use, visual interface.</li>
            <li><span className="text-blue-400 font-semibold">No Coding Required</span> – Create interactive and responsive designs without any programming knowledge.</li>
            <li><span className="text-blue-400 font-semibold">Optimized for SEO & Performance</span> – Websites are built with best practices for speed, responsiveness, and search engine rankings.</li>
            <li><span className="text-blue-400 font-semibold">Scalability & Flexibility</span> – Whether for personal use or large-scale projects, IITGWebPro adapts to your needs.</li>
          </ul>
        </section>
  
        {/* Our Vision Section */}
        <section className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-['Montserrat'] font-semibold text-white">Our Vision</h2>
          <p className="mt-4 text-lg font-['Inter'] text-gray-300">
            We believe that <span className="font-semibold text-white">website development should be intuitive and accessible to all.</span> With <span className="font-semibold text-white">IITGWebPro</span>, we are redefining the way websites are built—offering a seamless, intelligent, and flexible experience that keeps you in complete control.
          </p>
          <p className="mt-6 text-lg font-['Inter'] text-gray-300">
            Start <span className="text-blue-400 font-semibold">building</span> and <span className="text-blue-400 font-semibold">editing</span> your perfect website today with <span className="font-semibold text-white">IITGWebPro</span>—<span className="text-blue-400 font-bold">the future of smart web design!</span>
          </p>
        </section>
      </div>
      </>
    );
  }
  