import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import baner1 from "../../assets/banner/banner1.png"
import banner2 from "../../assets/banner/banner2.png"
import baner3 from "../../assets/banner/banner3.png"
import aro from "../../assets/banner/arrow-up-right 1.png"
import { NavLink } from 'react-router';

const slides = [
    { image: baner1, alt: 'Reliable parcel delivery with ZapShift' },
    { image: banner2, alt: 'Fast delivery and easy parcel pickup' },
    { image: baner3, alt: 'Doorstep delivery in 30 minutes' },
]

const Banner = () => {
    return (
        <div className="main overflow-hidden rounded-2xl">
             <Carousel
                autoPlay
                emulateTouch
                infiniteLoop
                interval={3500}
                showIndicators={false}
                showStatus={false}
                showThumbs={false}
                swipeable
             >
                {slides.map((slide, index) => (
                    <div key={slide.image} className="relative overflow-hidden rounded-2xl bg-white">
                        <img
                            src={slide.image}
                            alt={slide.alt}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            fetchPriority={index === 0 ? 'high' : 'low'}
                            decoding="async"
                            className="aspect-[4/3] w-full object-cover object-left sm:aspect-auto sm:object-contain"
                        />
                        <div className="flex items-center justify-center gap-2 px-2 py-3 sm:absolute sm:bottom-5 sm:left-4 sm:z-10 sm:justify-start sm:p-0 lg:bottom-16 lg:left-6">
                            <NavLink
                                to="/track-parcel"
                                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#CAEB66] px-3 text-xs font-bold text-[#03373D] shadow-sm min-[380px]:px-4 min-[380px]:text-sm lg:px-5 lg:text-lg"
                            >
                                Track Your Parcel
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black p-1.5">
                                    <img src={aro} alt="" />
                                </span>
                            </NavLink>
                            <NavLink
                                to="/bearider"
                                className="inline-flex min-h-11 items-center rounded-xl border border-[#03373D]/30 bg-white px-3 text-xs font-bold text-[#03373D] shadow-sm min-[380px]:px-4 min-[380px]:text-sm lg:px-5 lg:text-lg"
                            >
                                Be A Rider
                            </NavLink>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Banner;
