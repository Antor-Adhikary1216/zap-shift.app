const ReviwCard = ({data}) => {
    return (
        <div className="h-full py-2">
            <div className="h-full rounded-lg bg-white p-5 shadow-lg sm:p-8 lg:p-10">
                <p className="leading-6 text-[#303030]">{data.review}</p>
                <div className="border-b my-2 "></div>
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="shrink-0">
                       <img src={data.user_photoURL} alt="" className="size-[50px] rounded-full object-cover" />
                    </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-semibold text-[#03373D] sm:text-xl">{data.userName}</h2>
                        <p className="break-words text-sm text-[#606060] sm:text-[15px]">{data.delivery_email}</p>
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
