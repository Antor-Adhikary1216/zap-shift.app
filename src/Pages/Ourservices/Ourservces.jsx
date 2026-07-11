import React, { use } from 'react';
import OurservecesCard from './OurservecesCard';

const Ourservces = ({OurservecresPromises}) => {
    const servdata = use(OurservecresPromises)
    console.log(servdata)
    return (
        <div>
            <div className="my-10 rounded-2xl bg-[#03373D] px-4 py-10 sm:px-8 lg:my-15 lg:p-15">
                <h1 className='my-3 text-center text-3xl font-bold text-white sm:text-4xl'>Our Services</h1>
                <p className='text-[#DADADA] text-center text-[16px]'>Enjoy fast, reliable parcel delivery with real-time tracking and <br />zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>
                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:my-4 lg:grid-cols-3">
                    {
                        servdata.map(data=><OurservecesCard key={data.id} data={data}></OurservecesCard>)
                    }
                </div>
            </div>
        </div>
    );
};

export default Ourservces;
