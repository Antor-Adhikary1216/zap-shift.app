import { useEffect } from 'react';
import axios from "axios";
import useAuth from '../useAuth/useAuth';


const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000"
})




const UseaxiosSecure = () => {

const {user} = useAuth()
// intersept 
    useEffect(()=>{
        const requestInterceptor = axiosSecure.interceptors.request.use(async config=>{
            if (user) {
                const token = await user.getIdToken()
                config.headers.Authorization = `Bearer ${token}`
            } else {
                delete config.headers.Authorization
            }

            return config 
        })

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor)
        }
    }
    ,[user])


    return axiosSecure
};

export default UseaxiosSecure;
