import { useEffect } from 'react';
import axios from "axios";
import useAuth from '../useAuth/useAuth';
import { startGlobalLoading } from '../../Utilities/globalLoading';


const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000"
})

axiosSecure.interceptors.request.use((config) => {
    if (config.skipGlobalLoading || config.method?.toLowerCase() === 'get') return config
    config.completeGlobalLoading = startGlobalLoading(config.loadingMessage || 'Loading your data...')
    return config
}, (error) => Promise.reject(error))

axiosSecure.interceptors.response.use((response) => {
    response.config.completeGlobalLoading?.()
    return response
}, (error) => {
    error.config?.completeGlobalLoading?.()
    return Promise.reject(error)
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
