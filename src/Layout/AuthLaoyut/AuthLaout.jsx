import React from 'react';
import Logo from "../../Components/Logo/Logo"


import Login from '../../Components/Login/Login';
import Register from '../../Components/Register/Register';

const AuthLaout = () => {
    return (
        <div className='p-10 mx-auto'>
            <div className="flex">
                 <Logo></Logo> 
                 <p className='my-auto font-medium text-2xl'>Zapshfit</p> 

                

            </div>
             <Login></Login>
            
           
        </div>
    );
};

export default AuthLaout; 