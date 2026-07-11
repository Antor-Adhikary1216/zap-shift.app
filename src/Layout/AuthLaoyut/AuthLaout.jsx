import React from 'react';
import Logo from "../../Components/Logo/Logo"
import { NavLink, Outlet } from 'react-router';
import g from "../../assets/png/TeamsDwon/authImage.png"
import Goback from '../../Hooks/GootoHomePage/Goback';



const AuthLaout = () => {
    return (
        <div className='mx-auto min-h-screen max-w-7xl px-4 py-5 sm:px-6 lg:px-8'>
           <NavLink to="/">
             <div className="flex">
                 <Logo></Logo> 
                 <p className='my-auto font-medium text-2xl'>Zapshfit</p> 

            </div>

           </NavLink>
          
            <div className="my-8 grid items-center gap-8 lg:my-20 lg:grid-cols-2">
                <div className="min-w-0">
                    <Outlet></Outlet>
                </div>
                <div className='hidden lg:block'>
                    <img src={g} alt="" className="h-auto w-full" />
                </div>
            </div>
            
            
           
        </div>
    );
};

export default AuthLaout; 
