import FastMarquee from "react-fast-marquee";
import CompenesLogos from './CompenesLogos';

const Marquee = FastMarquee.default || FastMarquee
const Helps = () => {
    return (
        <section className="overflow-hidden">
            <h1 className="my-8 text-center text-2xl font-bold leading-tight text-[#03373D] sm:my-10 sm:text-[28px]">We've helped thousands of sales teams</h1>
            <div>
                <Marquee autoFill pauseOnHover speed={35} gradient gradientColor="#d1d5db" gradientWidth={40}>
                    <CompenesLogos />
                </Marquee>
                <div className="my-8 border-b border-dashed text-[#03464D] sm:my-10"></div>
            </div>
        </section>
    );
};

export default Helps;
