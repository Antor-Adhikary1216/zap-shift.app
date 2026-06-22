import React from 'react';
import Logo from "../../Components/Logo/Logo"
import { NavLink, Outlet } from 'react-router';
import g from "../../assets/png/TeamsDwon/authImage.png"
import Goback from '../../Hooks/GootoHomePage/Goback';



const AuthLaout = () => {
    return (
        <div className='max-w-7xl mx-auto'>
           <NavLink to="/">
             <div className="flex">
                 <Logo></Logo> 
                 <p className='my-auto font-medium text-2xl'>Zapshfit</p> 

            </div>

           </NavLink>
          
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