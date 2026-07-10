import React, { useEffect } from 'react';
import axios from "axios";
import { PiConfettiThin } from 'react-icons/pi';
import useAuth from '../useAuth/useAuth';


const axiosSecure = axios.create({
    baseURL:"http://localhost:3000"
})




const UseaxiosSecure = () => {

const {user} = useAuth()
// intersept 
    useEffect(()=>{
        axiosSecure.interceptors.request.use(config=>{
            config.headers.Authorization=`Bearer ${user?.accessToken} `
            return config 
        })
    }
    ,[user])


    return axiosSecure
};

export default UseaxiosSecure;