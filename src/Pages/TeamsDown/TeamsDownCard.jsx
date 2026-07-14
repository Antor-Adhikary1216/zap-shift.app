import f1 from '../../assets/png/TeamsDwon/live-tracking.png'
import f2 from '../../assets/png/TeamsDwon/safe-delivery.png'
import f3 from '../../assets/png/TeamsDwon/tiny-deliveryman.png'

const featureImages = {
    1: f1,
    2: f2,
    3: f3,
}

const TeamsDownCard = ({data}) => {
    const featureImage = featureImages[data.id] || f1

    return (
        <div>
           <div className="my-4 rounded-lg bg-white p-5 shadow-md sm:p-6">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-8 sm:text-left lg:gap-10">
                    
                    <img src={featureImage} alt="" className="max-h-32 w-auto max-w-full shrink-0 object-contain sm:max-h-40" />
                    <div className="min-w-0 justify-center py-2 sm:p-5">
                        <h2 className="my-2 text-xl font-semibold text-[#03373D] sm:text-2xl">{data.title}</h2>
                    <p className="my-3 text-base leading-7 text-[#606060] sm:my-4">{data.description}</p>
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
