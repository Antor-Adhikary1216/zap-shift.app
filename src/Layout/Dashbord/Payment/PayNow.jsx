import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { data, useParams } from 'react-router';
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure';
import { FaRupeeSign } from 'react-icons/fa';

const PayNow = () => {


const {parcelId}=useParams()
  const axiosSecure = UseaxiosSecure()
const {  data : parcel} =useQuery({
    queryKey:["parcels",parcelId],
    queryFn : async()=>{
        const res =  await axiosSecure.get(`parcels/${parcelId}`)
        return res.data
    }
})



const handelPyment = async()=>{
const paymenInfo = {
    cost:  parcel.cost ,
    parcelId: parcel._id ,
    senderEmail: parcel.senderEmail, 
    parcelName: parcel.parcelName,
}
const res = await axiosSecure.post("/Create-checkout-session",paymenInfo)
window.location.href = res.data.url 
console.log(res.data)

}

    return (
        <div>
            <h2 className='text-3xl '>Pay your payment- <br/>
            <p>Prcel Id : {parcel._id}</p>
               parcel Name: <span className='font-bold'>{parcel.parcelName}</span> </h2>
               <p className='flex items-center gap-2 text-2xl  '>parcel amount : { parcel.cost} <span> <FaRupeeSign /></span></p>
            <h2 className='my-3 text-2xl font-medium text-gray-700'>please pay </h2>
            <button onClick={handelPyment} className='btn bg-amber-400 btn-sm   my-5  '> pay Now  </button>
        </div>
    );
};

export default PayNow;