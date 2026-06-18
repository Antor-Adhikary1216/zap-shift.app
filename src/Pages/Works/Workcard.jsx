import React, { use } from 'react';
import delevery from "../../assets/png/bookingIcon.png"

const Workcard = ({data}) => {
// const [title,description,icon] =data
   
    return (
        <div>
            <div className=" rounded-lg px-8 py-2 items-center justify-center lg:h-[260px] bg-white shadow-md">
                <img src={delevery} className='lg:w-[50px] lg:h-[50px]'  />
                <p className='text-[18px] font-medium my-3'>{data.title}</p>
                <p className='text-[#606060] text-[16px]'>{data.description}</p>
            </div>
        </div>
    );
};

export default Workcard;

// {
//     "id": 1,
//     "title": "Booking Pick & Drop",
//     "description": "From personal packages to business shipments — we deliver on time, every time.",
//     "icon": "truck"
// }