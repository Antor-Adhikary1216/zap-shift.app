import React, { use } from 'react';
import OurservecesCard from './OurservecesCard';

const Ourservces = ({OurservecresPromises}) => {
    const servdata = use(OurservecresPromises)
    console.log(servdata)
    return (
        <div>
            <div className="bg-[#03373D] p-15 my-15 rounded-2xl ">
                <h1 className='text-white text-center text-4xl my-3 font-bold '>Our Services</h1>
                <p className='text-[#DADADA] text-center text-[16px]'>Enjoy fast, reliable parcel delivery with real-time tracking and <br />zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>
                <div className="my-4 lg:grid grid-cols-3 gap-5 items-center ">
                    {
                        servdata.map(data=><OurservecesCard key={data.id} data={data}></OurservecesCard>)
                    }
                </div>
            </div>
        </div>
    );
};

export default Ourservces;