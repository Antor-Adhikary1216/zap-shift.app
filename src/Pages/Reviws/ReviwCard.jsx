import React from 'react';

const ReviwCard = ({data}) => {
    console.log(data)
    return (
        <div>
            <div className="bg-white shadow-lg p-10 rounded-lg">
                <p>{data.review}</p>
                <div className="border-b my-2 "></div>
                <div className="flex gap-4 items-center">
                    <div className="">
                       <img src={data.user_photoURL} className='w-[50px] h-[50px] rounded-full' />
                    </div>
                        <div className="">
                            <h2 className='text-[#03373D] font-medium text-[20px]'>{data.userName}</h2>
                        <p className='text-[#606060] text-[15px]'>{data.delivery_email}</p>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default ReviwCard;

// {
//     "id": "5f47ac10b4f1c03e8c567898",
//     "user_email": "aman.khan@example.com",
//     "userName": "Aman Khan",
//     "delivery_email": "delivery9@example.com",
//     "ratings": 2.5,
//     "review": "The delivery was delayed and the package condition was not good.",
//     "parcel_id": "5f47ac10b4f1c03e8c098773",
//     "pick_up_email": "pickup9@example.com",
//     "user_photoURL": "https://randomuser.me/api/portraits/men/28.jpg",
//     "date": "2024-08-10T17:50:00.000Z"
// }