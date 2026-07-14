import Logo from '../../../Components/Logo/Logo';
import aro from "../../../assets/banner/arrow-up-right 1.png"
import zapShiftLogo from '../../../assets/logo.png'
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import './nav.css'
import useAuth from '../../../Hooks/useAuth/useAuth';
import useUserRole from '../../../Hooks/useUserRole/useUserRole';

const Navbar = () => {
  const {user, loading, Logout} = useAuth()
    const navigate = useNavigate()
    const { isAdmin, isRoleLoading } = useUserRole()

    useEffect(() => {
      localStorage.removeItem('zapshift-login-prompt-seen')
      if (loading || user || sessionStorage.getItem('zapshift-login-prompt-seen')) return

      sessionStorage.setItem('zapshift-login-prompt-seen', 'true')
      Swal.fire({
        imageUrl: zapShiftLogo,
        imageWidth: 72,
        imageHeight: 72,
        imageAlt: 'ZapShift logo',
        title: 'Welcome to ZapShift',
        html: '<p class="zapshift-login-brand">Fast. Reliable. Right on time.</p><p>Log in to check coverage, calculate pricing, send parcels, and manage every delivery.</p>',
        confirmButtonText: 'Log in now',
        showCancelButton: true,
        cancelButtonText: 'Maybe later',
        showCloseButton: true,
        buttonsStyling: false,
        backdrop: 'rgba(3, 55, 61, 0.62)',
        customClass: {
          popup: 'zapshift-login-popup',
          image: 'zapshift-login-logo',
          title: 'zapshift-login-title',
          htmlContainer: 'zapshift-login-copy',
          actions: 'zapshift-login-actions',
          confirmButton: 'zapshift-login-confirm',
          cancelButton: 'zapshift-login-cancel',
          closeButton: 'zapshift-login-close',
        },
      }).then((result) => {
        if (result.isConfirmed) navigate('/login')
      })
    }, [loading, navigate, user])

    const navLinkClass = ({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'
    const links = <>
        {user && !isRoleLoading && (isAdmin ? (
          <NavLink to="/dashbord/user-management" className={navLinkClass}><li>Dashboard</li></NavLink>
        ) : <>
          <NavLink to="/services" className={navLinkClass}><li>Services</li></NavLink>
          <NavLink to="/Coverags" className={navLinkClass}><li>Coverage</li></NavLink>
          <NavLink to="/aboutUs" className={navLinkClass}><li>About Us</li></NavLink>
          <NavLink to="/bargainnig" className={navLinkClass}><li>Pricing</li></NavLink>
          <NavLink to="/send_a_parcel" className={navLinkClass}><li>Send Parcel</li></NavLink>
          <NavLink to="/dashbord/my-parcels" className={navLinkClass}><li>Dashboard</li></NavLink>
        </>)}
    </>

    const landealLogOut = ()=>{
      Logout()
      .then(()=>{
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Logged out successfully',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        })
      })
      .catch(() => undefined)
    }
    return (
        <div className="relative z-[1000]">
            <div className="navbar min-h-16 flex-wrap gap-y-2 rounded-[10px] bg-white px-2 py-2 shadow-md sm:flex-nowrap sm:px-4 sm:py-0 lg:max-w-full lg:px-7">
  <div className="navbar-start min-w-0 flex-1">
    <div className={user ? 'dropdown' : 'hidden'}>
      <div tabIndex={0} role="button" aria-label="Open navigation menu" className="btn btn-ghost btn-square min-h-11 min-w-11 lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content z-[1100] mt-3 w-[min(18rem,calc(100vw-2rem))] rounded-box bg-white p-2 shadow-xl">
        {links}
      </ul>
    </div>
    {/* LOGO degins -> */}
   <NavLink to="/" aria-label="ZapShift home" className="inline-flex min-h-11 min-w-11 shrink-0 items-center"> <div className="logo flex shrink-0 cursor-pointer">
        <Logo></Logo>
        <p className='my-auto hidden text-xl font-semibold text-[#303030] sm:block sm:text-2xl'>ZapShift</p>
    </div></NavLink>
  </div>
  <div className="navbar-center hidden lg:flex px-1">
    <ul className="menu menu-horizontal gap-1 text-center text-[16px] font-medium text-[#606060]">
     {links}
    </ul>
  </div>
  <div className="navbar-end w-full shrink-0 justify-end gap-2 login sm:w-auto sm:gap-1">
    
    {
      user ? 
      <button onClick={landealLogOut} className="btn btn-sm min-h-10 rounded-xl btn-outline text-[#606060] sm:btn-md lg:font-semibold lg:text-[18px]">Sign Out</button>
     
       : <NavLink to="/login" className="shrink-0"> <span className="btn btn-sm min-h-10 rounded-xl btn-outline text-[#606060] sm:btn-md lg:font-semibold lg:text-[18px]">Sign In</span></NavLink>
    
    }
    {!isRoleLoading && !isAdmin && <>
      <NavLink to="/bearider" className="btn btn-sm min-h-10 shrink-0 rounded-xl btn-outline px-3 text-[#606060] sm:btn-md sm:px-4 lg:font-semibold lg:text-[18px]">Be a rider</NavLink>
      <NavLink to="/" aria-label="Go to home page" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black p-2.5 sm:size-11"><img src={aro} alt="" /></NavLink>
    </>}
  </div>
</div>
        </div>
    );
};

export default Navbar;
