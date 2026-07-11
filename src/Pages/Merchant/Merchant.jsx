import React from 'react';
import M from "../../assets/png/TeamsDwon/Frame 2087326212.png"
import R from "../../assets/png/TeamsDwon/customer-top.png"

const Merchant = () => {
    return (
        <div className='my-6 '>
            <img src={M} alt="" className="h-auto w-full" />
            <div className="my-10 sm:my-15">
                <img src={R} alt="" className='mx-auto max-w-full' />
               <div className=" text-center my-5">
                 <h1 className='text-[28px] my-3 font-bold'>What our customers are sayings</h1>
                <p className='text-[#606060] text-[16px]'>Enhance posture, mobility, and well-being effortlessly <br /> with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!</p>
               </div>
            </div>
        </div>
    );
};

export default Merchant;
