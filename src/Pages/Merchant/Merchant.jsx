import M from "../../assets/png/TeamsDwon/Frame 2087326212.png"
import R from "../../assets/png/TeamsDwon/customer-top.png"

const Merchant = () => {
    return (
        <section className="my-6">
            <img src={M} alt="" className="h-auto w-full rounded-xl" />
            <div className="my-8 sm:my-15">
                <img src={R} alt="" className='mx-auto max-w-full' />
               <div className="my-5 text-center">
                 <h2 className="my-3 text-2xl font-bold leading-tight sm:text-[28px]">What our customers are sayings</h2>
                <p className="mx-auto max-w-2xl text-sm leading-6 text-[#606060] sm:text-base sm:leading-7">Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!</p>
               </div>
            </div>
        </section>
    );
};

export default Merchant;
