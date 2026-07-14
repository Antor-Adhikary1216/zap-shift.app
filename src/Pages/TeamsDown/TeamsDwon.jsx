import { use } from 'react';
import TeamsDownCard from './TeamsDownCard';

const TeamsDwon = ({servesPromises}) => {
    const datas = use(servesPromises)

    return (
        <section className="my-8 sm:my-10">
            {
             datas.map(data=> <TeamsDownCard key={data.id} data={data}></TeamsDownCard>)   
            }
            <div className="my-8 border-b sm:my-10"></div>
        </section>
    );
};

export default TeamsDwon;
