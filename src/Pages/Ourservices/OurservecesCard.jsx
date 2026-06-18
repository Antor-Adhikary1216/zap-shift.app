import React from 'react';
import servecs from "../../assets/png/service.png"
import { NavLink } from 'react-router';

const OurservecesCard = ({data}) => {

    

    return (
        <div>
           <NavLink>
            <div className='bg-white  rounded-lg lg:max-w-[410px] lg:h-[300px]  '>
                <img src={servecs} alt="" className='' />
                <p className="">{data.title}</p>
                <p className="">{data.description}</p>
                
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