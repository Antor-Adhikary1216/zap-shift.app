import React from 'react';
import Marquee from "react-fast-marquee";
import CompenesLogos from './CompenesLogos';
const Helps = () => {
    return (
        <div>
            <h1 className='my-10 text-center  text-[#03373D] text-[28px] font-bold'>We've helped thousands of sales teams</h1>
            <div className="">
                   <marquee behavior="scroll" direction="left" scrollamount="10">
                                    <CompenesLogos/>
                 </marquee>
                 <div className="border-dashed border-b my-10 text-[#03464D]"></div>
            </div>
        </div>
    );
};

export default Helps;