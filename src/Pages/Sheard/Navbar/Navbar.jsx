import React, { use } from 'react';
import Logo from '../../../Components/Logo/Logo';
import aro from "../../../assets/banner/arrow-up-right 1.png"
import { NavLink } from 'react-router';
import './nav.css'
import useAuth from '../../../Hooks/useAuth/useAuth';

const Navbar = () => {
  const {user,Logout} = useAuth()
    const links = <>
        <NavLink to="services" ><li>Services </li></NavLink>
        <NavLink to="Coverags" ><li>Coverage</li></NavLink>
        <NavLink to="aboutUs" ><li>About Us</li></NavLink>
        <NavLink to="bargainnig" ><li>Pricing</li></NavLink>
        <NavLink to="bearider" ><li>Be a Rider</li></NavLink>
    </>

    const landealLogOut = ()=>{
      Logout()
      .then()
      .catch(error=>{
        console.log(error)
      })
    }
    return (
        <div>
            <div className="navbar shadow-md lg:max-w-325 mx-auto rounded-[10px] bg-white  lg:px-7">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow hover:bg-base-300">
        {links}
      </ul>
    </div>
    {/* LOGO degins -> */}
   <NavLink to="/"> <div className="logo flex cursor-pointer">
        <Logo></Logo>
        <p className='my-auto text-2xl font-semibold text-[#303030]'>ZapShift</p>
    </div></NavLink>
  </div>
  <div className="navbar-center hidden lg:flex p-2 ">
    <ul className="menu menu-horizontal  gap-6 text-center text-[16px] font-medium text-[#606060]">
     {links}
    </ul>
  </div>
  <div className="navbar-end gap-2 login ">
    
    {
      user ? 
      <button onClick={landealLogOut} className="btn   btn-outline rounded-xl  text-[#606060] lg:font-semibold lg:text-[18px]  ">Sign Out</button>
     
       : <NavLink to="/login" > <button className="btn   btn-outline rounded-xl  text-[#606060] lg:font-semibold lg:text-[18px]  ">Sign In</button></NavLink>
    
    }
    <NavLink to="bearider" > <button  className="btn  btn-outline rounded-xl  text-[#606060]  lg:font-semibold lg:text-[18px] ">Be a rider</button></NavLink>
        <NavLink to=""> <div className='bg-black p-2 rounded-full'><img src={aro}  /></div>  </NavLink>
  </div>
</div>
        </div>
    );
};

export default Navbar;