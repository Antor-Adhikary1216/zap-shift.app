import React from 'react';
import useAuth from '../Hooks/useAuth/useAuth';
import { Navigate } from 'react-router';

const PrivetRoute = ({children}) => {

    const {user,loading}=useAuth()

    if(loading){
        return <div className="">
            <span className="loading loading-spinner loading-xl"></span>
        </div>
    }
    if(!user){
        return <Navigate to='/login' ></Navigate>
       

    }
    return children
};

export default PrivetRoute;