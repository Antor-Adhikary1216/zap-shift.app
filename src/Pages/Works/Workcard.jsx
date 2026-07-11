import React, { use } from 'react';
import delevery from "../../assets/png/bookingIcon.png"

const Workcard = ({data}) => {
// const [title,description,icon] =data
   
    return (
        <div className="h-full">
            <div className="h-full rounded-lg bg-white px-6 py-6 shadow-md lg:h-[260px] lg:px-8">
                <img src={delevery} alt="" className='h-[50px] w-[50px]' />
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
