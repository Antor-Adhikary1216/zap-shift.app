import React from 'react';
import Logo from "../../Components/Logo/Logo"
import { Outlet } from 'react-router';
import g from "../../assets/png/TeamsDwon/authImage.png"



const AuthLaout = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <div className="flex">
                 <Logo></Logo> 
                 <p className='my-auto font-medium text-2xl'>Zapshfit</p> 
            </div>
            <div className="flex my-20 ">
                <div className="flex-1">
                    <Outlet></Outlet>
                </div>
                <div className='flex-1'>
                    <img src={g} alt="" />
                </div>
            </div>
            
            
           
        </div>
    );
};

export default AuthLaout; 