import { use } from 'react';
import OurservecesCard from './OurservecesCard';

const Ourservces = ({OurservecresPromises}) => {
    const servdata = use(OurservecresPromises)
    return (
        <div>
            <div className="my-8 rounded-2xl bg-[#03373D] px-4 py-9 sm:my-10 sm:px-8 sm:py-10 lg:my-15 lg:p-15">
                <h1 className="my-3 text-center text-3xl font-bold text-white sm:text-4xl">Our Services</h1>
                <p className="mx-auto max-w-3xl text-center text-sm leading-6 text-[#DADADA] sm:text-base sm:leading-7">Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>
                <div className="mt-7 grid gap-5 md:grid-cols-2 lg:my-6 lg:grid-cols-3">
                    {
                        servdata.map(data=><OurservecesCard key={data.id} data={data}></OurservecesCard>)
                    }
                </div>
            </div>
        </div>
    );
};

export default Ourservces;
