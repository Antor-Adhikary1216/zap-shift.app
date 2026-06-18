import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import baner1 from "../../assets/banner/banner1.png"
import banner2 from "../../assets/banner/banner2.png"
import baner3 from "../../assets/banner/banner3.png"
import aro from "../../assets/banner/arrow-up-right 1.png"



const Banner = () => {
    return (
        <div className="main">
             <Carousel autoPlay infiniteLoop interva={2000}>
                <div>
                 <div className=' absolute bottom-37  left-1    lg:absolute  lg:bottom-20 lg:left-3 flex gap-2 items-center'>
                        <button className='text-[9px] lg:text-[18px] p-1 lg:px-3.5 lg:py-2.5 text-center  rounded-full bg-[#CAEB66]  font-medium'>Track Your Parcel</button>
                        <div className="bg-black w-5.5 h-5.5 lg:w-6 lg:h-6 lg:p-1 rounded-full"><img src={aro} alt=""  /></div>
                        <button className='border p-1 lg:px-3 lg:py-1.5 rounded-lg text-[9px] lg:text-[18px] font-medium bg-white'>Be A Rider</button>
                    </div>
                    <img src={baner1}   />
                  
                </div>
                <div>
                     <div className=' absolute bottom-37  left-1    lg:absolute  lg:bottom-20 lg:left-3 flex gap-2 items-center'>
                        <button className='text-[9px] lg:text-[18px] p-1 lg:px-3.5 lg:py-2.5 text-center  rounded-full bg-[#CAEB66]  font-medium'>Track Your Parcel</button>
                        <div className="bg-black w-5.5 h-5.5 lg:w-6 lg:h-6 lg:p-1 rounded-full"><img src={aro} alt=""  /></div>
                        <button className='border p-1 lg:px-3 lg:py-1.5 rounded-lg text-[9px] lg:text-[18px] font-medium bg-white'>Be A Rider</button>
                    </div>
                    <img src={banner2} />
                   
                </div>
                <div>
                     <div className=' absolute bottom-37  left-1    lg:absolute  lg:bottom-20 lg:left-3 flex gap-2 items-center'>
                        <button className='text-[9px] lg:text-[18px] p-1 lg:px-3.5 lg:py-2.5 text-center  rounded-full bg-[#CAEB66]  font-medium'>Track Your Parcel</button>
                        <div className="bg-black w-5.5 h-5.5 lg:w-6 lg:h-6 lg:p-1 rounded-full"><img src={aro} alt=""  /></div>
                        <button className='border p-1 lg:px-3 lg:py-1.5 rounded-lg text-[9px] lg:text-[18px] font-medium bg-white'>Be A Rider</button>
                    </div>
                    <img src={baner3} />
                  
                </div>
            </Carousel>
        </div>
    );
};

export default Banner;