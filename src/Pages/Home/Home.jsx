import { lazy } from 'react';
import Banner from '../Banner/Banner';
import Work from '../Works/work';
import Ourservces from '../Ourservices/Ourservces';
import Helps from '../Helps/Helps';
import TeamsDwon from '../TeamsDown/TeamsDwon';
import Merchant from '../Merchant/Merchant';
import DeferredSection from '../../Components/DeferredSection/DeferredSection';

const Reviws = lazy(() => import('../Reviws/Reviws'))

const workpromises = fetch("/Workcard.json")
.then(res=>res.json())

const OurservecresPromises = fetch("/OurServeses.json")
.then(res=>res.json())
const servesPromises = fetch("/Servesdata.json")
.then(res=>res.json())

const ReviwPromises = fetch("/Reviw.json").then(res=>res.json())


const Home = () => {
    return (
        <div className='mt-5 sm:mt-10'>
            <Banner />
            <Work key={workpromises.id} workpromises={workpromises}></Work>
            <Ourservces key={OurservecresPromises.id}  OurservecresPromises={OurservecresPromises} ></Ourservces>
          <Helps></Helps>
          <TeamsDwon key={servesPromises.id} servesPromises={servesPromises} ></TeamsDwon>
          <Merchant></Merchant>
          <DeferredSection minHeight="32rem">
            <Reviws ReviwPromises={ReviwPromises} />
          </DeferredSection>
        </div>
    );
};

export default Home;
