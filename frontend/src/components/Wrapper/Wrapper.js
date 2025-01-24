import React from 'react';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

const Wrapper = ({ CurrentComponent }) => {
  const location = useLocation();

return (
    <div className="min-h-screen bg-gradient-to-br from-[#171124] to-[#1c142b]">
        {/* Main Container */}
        <main className="w-full h-[100vh] overflow-x-hidden flex justify-center items-center bg-gradient-to-br from-[#171124] to-[#1c142b] px-4">
            <div className="w-[90%] md:w-[80%] lg:w-[60%] h-[60%] md:h-[70%] flex flex-col md:flex-row justify-center items-center bg-gradient-to-br from-[#171124] to-[#1c142b] rounded-[50px] shadow-[10px_10px_20px_#120d1c,_-10px_-10px_20px_#221934] transition-all duration-300">
                {/* Animation Card - Hidden on mobile */}
                                <div className="hidden md:block w-[45%] h-[90%] pl-5">
                                    <Swiper
                                        spaceBetween={30}
                                        pagination={{ clickable: true }}
                                        modules={[Pagination, Autoplay]}
                                        className="h-full w-full"
                                        autoplay={{ delay: 2500 }}
                                    >
                                        <SwiperSlide>
                                            <img src="/images/WhatsApp Image 2025-01-24 at 10.45.56 AM (1).jpeg" alt="img" className="rounded-[15px] w-full h-full object-cover" />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src="/images/WhatsApp Image 2025-01-24 at 10.45.56 AM (2).jpeg" alt="img" className="rounded-[15px] w-full h-full object-cover" />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src="/images/WhatsApp Image 2025-01-24 at 10.45.56 AM.jpeg" alt="img" className="rounded-[15px] w-full h-full object-cover" />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src="/images/WhatsApp Image 2025-01-24 at 10.45.57 AM.jpeg" alt="img" className="rounded-[15px] w-full h-full object-cover" />
                                        </SwiperSlide>
                                    </Swiper>
                                </div>

                                {/* Current Component - Full width on mobile */}
                <div className="flex-grow md:w-auto">
                    {CurrentComponent}
                </div>
            </div>
        </main>
    </div>
);
};

export default Wrapper;