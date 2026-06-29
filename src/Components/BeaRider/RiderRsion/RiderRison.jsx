import React, { use } from 'react';


const RiderRison = ({resonPromsese}) => {
    const data = use(resonPromsese)
    return (
        <div>
               <fieldset className="fieldset">
                       <legend className="fieldset-legend">Your Region</legend>
                      <select defaultValue="select " className="select">
                        <option disabled={true}>select your region</option>
                        <option>select your region</option>
                         
                        </select>
                           </fieldset> 
        </div>
    );
};

export default RiderRison;