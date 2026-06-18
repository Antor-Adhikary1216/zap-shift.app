import React from 'react';
import Banner from '../Banner/Banner';
import Work from '../Works/work';
import Ourservces from '../Ourservices/Ourservces';
import Helps from '../Helps/Helps';

const workpromises = fetch("/Workcard.json")
.then(res=>res.json())

const OurservecresPromises = fetch("/OurServeses.json")
.then(res=>res.json())



const Home = () => {
    return (
        <div className='mt-10'>
            <Banner></Banner>
            <Work key={workpromises.id} workpromises={workpromises}></Work>
            <Ourservces key={OurservecresPromises.id}  OurservecresPromises={OurservecresPromises} ></Ourservces>
          <Helps></Helps>
        </div>
    );
};

export default Home;