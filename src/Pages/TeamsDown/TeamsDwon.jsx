import React, { use } from 'react';
import TeamsDownCard from './TeamsDownCard';

const TeamsDwon = ({servesPromises}) => {
    const datas = use(servesPromises)

    return (
        <div className='my-10 gap-10 '>
            {
             datas.map(data=> <TeamsDownCard key={data.id} data={data}></TeamsDownCard>)   
            }
            <div className="border-b my-10"></div>
        </div>
    );
};

export default TeamsDwon;