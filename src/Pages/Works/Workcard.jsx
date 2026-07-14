import delevery from "../../assets/png/bookingIcon.png"

const Workcard = ({data}) => {
// const [title,description,icon] =data
   
    return (
        <div className="h-full">
            <div className="h-full rounded-lg bg-white px-5 py-6 shadow-md sm:px-6 lg:min-h-[260px] lg:px-8">
                <img src={delevery} alt="" className='h-[50px] w-[50px]' />
                <p className="my-3 text-lg font-semibold">{data.title}</p>
                <p className="text-base leading-6 text-[#606060]">{data.description}</p>
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
