import React from 'react';
import Banner from '../Banner/Banner';
import Work from '../Works/work';
import Ourservces from '../Ourservices/Ourservces';

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
        </div>
    );
};

export default Home;