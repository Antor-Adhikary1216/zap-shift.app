import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { data, useParams } from 'react-router';
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure';

const PayNow = () => {


const {parcelId}=useParams
const {  data : parcels} =useQuery({
    queryKey:["parcels",parcelId],
    queryFn : async()=>{
        const axiosSecure = UseaxiosSecure()
        const res =  await axiosSecure.get(`/parcels/${parcelId}`)
        return res.data
    }
})



const handelPyment = async()=>{
const paymentInfo = {
    cost  :"",
    parcelId:"",
    senderEmail:"", 
    parcelName:"",
}
const res = await axiosSecure.post("/Create-checkout-session",paymentInfo)
window.location.href = res.data.url 
console.log(res)



}

    return (
        <div>
            <h2>Pay your payment </h2>
            <h2>please Pay </h2>
            <button onClick={handelPyment} className='btn bg-amber-400 btn-sm   my-5  '> pay Now  </button>
            
           


            
        </div>
    );
};

export default PayNow;