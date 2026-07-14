import { use } from 'react';
import Workcard from './Workcard';


const Work = ({workpromises}) => {
    const Wdata = use(workpromises)
    
    return (
        <section className="my-8 sm:my-15">
            <h1 className='text-2xl font-bold sm:text-[32px]'>How it Works</h1>
            <div className="grid gap-4 py-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-10 lg:py-10">
                {
                Wdata.map(data=><Workcard key={data.id} data={data}></Workcard>)
            }
            </div>
        </section>
    );
};

export default Work;
