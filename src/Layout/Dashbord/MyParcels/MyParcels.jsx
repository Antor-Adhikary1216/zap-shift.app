import { useQueries, useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../Hooks/useAuth/useAuth';
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure';

const MyParcels = () => {
    const {user} = useAuth()
    const axiosSecure = UseaxiosSecure()

const {data} =useQuery({
    
    queryKey:['my-parcels',user?.email],
    queryfunction:async()=>{
const res = await axiosSecure.get(`/parcel?email=${user.email}`)
return res.data

    }
    
})




    return (
        <div>
            All my parcels : {data}
            
        </div>
    );
};

export default MyParcels;