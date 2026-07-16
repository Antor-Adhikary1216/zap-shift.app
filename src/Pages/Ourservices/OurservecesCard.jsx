import servecs from "../../assets/png/service.png"
import { NavLink } from 'react-router';

const OurservecesCard = ({data}) => {

    

    return (
        <div>
           <NavLink className="block h-full">
            <div className="h-full rounded-lg bg-white p-5 sm:p-6 lg:min-h-[350px] lg:px-10 lg:py-5">
                
                    <img src={servecs} alt="" className="mx-auto my-2 size-[50px] rounded-full bg-[#EEEDFC] p-2" />
              
                <p className="my-3 text-center text-xl font-bold sm:text-2xl">{data.title}</p>
                <p className="my-2 text-center leading-6 text-[#606060]">{data.description}</p>
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
