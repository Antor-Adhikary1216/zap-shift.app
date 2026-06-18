import React, { use } from 'react';
import Workcard from './Workcard';


const Work = ({workpromises}) => {
    const Wdata = use(workpromises)
    
    return (
        <div className='my-15'>
            <h1 className='text-[32px] font-bold'>How it Works</h1>
            <div className="flex justify-center gap-10 my-10">
                {
                Wdata.map(data=><Workcard key={data.id} data={data}></Workcard>)
            }
            </div>
        </div>
    );
};

export default Work;