import Logo from "../../Components/Logo/Logo"
import { NavLink, Outlet } from 'react-router';
import g from "../../assets/png/TeamsDwon/authImage.png"



const AuthLaout = () => {
    return (
        <div className='mx-auto min-h-screen max-w-7xl overflow-x-hidden px-4 py-4 sm:px-6 sm:py-5 lg:px-8'>
           <NavLink to="/" className="inline-flex max-w-full">
             <div className="flex min-w-0 items-center">
                 <Logo></Logo> 
                 <p className='my-auto text-xl font-medium sm:text-2xl'>Zapshfit</p>

            </div>

           </NavLink>
          
            <div className="my-7 grid items-center gap-8 sm:my-10 lg:my-20 lg:grid-cols-2">
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
