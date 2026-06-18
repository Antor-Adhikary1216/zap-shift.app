import React from 'react';
import servecs from "../../assets/png/service.png"
import { NavLink } from 'react-router';

const OurservecesCard = ({data}) => {

    

    return (
        <div>
           <NavLink>
            <div className= 'bg-white  px-10 py-5 rounded-lg lg:max-w-[410px] lg:h-[350px] my-10 lg:my-5 '>
                
                    <img src={servecs} alt="" className='my-2 lg:w-[50px] lg:h-[50px] bg-[#EEEDFC] p-2 rounded-full lg:mx-auto' />
              
                <p className="font-bold text-[24px] text-center my-3 ">{data.title}</p>
                <p className="text-[#606060] text-center my-2">{data.description}</p> 
            </div>
           </NavLink>
        </div>
    );
};

export default OurservecesCard;

// {
//     "id": 1,
//     "title": "Express & Standard Delivery",
//     "description": "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
//     "highlighted": false
// }