import React from 'react';
import { NavLink } from 'react-router';
import Rpg from "../../assets/png/TeamsDwon/10238020_18060956 1.png"
import Logo from '../Logo/Logo';
import g from "../../assets/png/TeamsDwon/Google__G__Logo 1.png"

const Login = () => {
    return (
        <div className='p-10 mx-auto'>
            <div className="flex">
                 <Logo></Logo> 
                 <p className='my-auto font-medium text-2xl'>Zapshfit</p> 

                

            </div>
             <div className="flex justify-between my-10 px-25">
                <div className="fro">
               
                    <h1 className='text-3xl my-2 font-semibold'>Welcome Back</h1>
                    <p className=' text-[18px]'>Login with ZapShift</p>
                    <form className='my-5'>
                    </form>
                        <label>
                            <p className='my-1 text-md font-medium'>Email</p>
                            <input type="email" name='email' placeholder='Enter your Email' className='border lg:h-[30px] text-[16px] px-2 py-4 rounded-xl border-[#CBD5E1] lg:w-[300px] ' />
                        </label>
                        <label>
                            <p className='my-1 text-md font-medium'>Password</p>
                            <input type="email" name='Password' placeholder='Enter your Password' className='border lg:h-[30px] text-[16px] px-2 py-4 rounded-xl border-[#CBD5E1] lg:w-[300px] ' />
                        </label>
                            <p className='underline cursor-pointer text-[#71717a]'>Fotget pasword!</p>
                            <button className='w-full p-2 rounded-full my-2 text-[18px] font-medium bg-[#CAEB66]'> Login </button>
                               <p className='text-[#71717a]'> Don’t have any account? <NavLink to="/Register">Register</NavLink></p>
                                <button className="btn w-full my-3 rounded-full  text-[18px] bg-[#F5F5F5] border-[#e5e5e5]">
  <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
  Login with Google
</button>
                </div>

                <div className="">
                    <img src={Rpg} alt="" />
                </div>
            </div>
        </div>
    );
};

export default Login;