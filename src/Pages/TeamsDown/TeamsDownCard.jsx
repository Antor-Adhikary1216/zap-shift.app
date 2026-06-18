import React from 'react';
import f1 from '../../assets/png/TeamsDwon/live-tracking.png'
import f2 from '../../assets/png/TeamsDwon/safe-delivery.png'
import f3 from '../../assets/png/TeamsDwon/tiny-deliveryman.png'

const TeamsDownCard = ({data}) => {

    return (
        <div>
           <div className="bg-white shadow-md p-5 my-4 rounded-lg ">
                <div className="flex gap-10">
                    
                    <img src={f1} alt="" />
                    <div className="justify-center p-5">
                        <h1 className='text-[#03373D] text-[24px] font-medium my-2'>{data.title}</h1>
                    <p className='text-[#606060] text-[16px] my-4'>{data.description}</p>
                    </div>
                </div>
               
           </div>
            
        </div>
    );
};

export default TeamsDownCard;
// {
//     "id": 2,
//     "title": "100% Safe Delivery",
//     "": "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time."
// }