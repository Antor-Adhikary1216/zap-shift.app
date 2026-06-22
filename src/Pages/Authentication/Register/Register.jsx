import React from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router';
import useAuth from '../../../Hooks/useAuth/useAuth';
import Google from '../SocialLogin/Google';
import Goback from '../../../Hooks/GootoHomePage/Goback';

const Register = () => {
const {registerUser,} =useAuth()
    const {register,handleSubmit,
        formState:{errors}
    }=useForm()
    // submit function =>
        const submitHeandel = (e)=>{
            registerUser(e.email,e.password)
            .then(res=>{
                console.log(res.user)
            })
            .catch(error=>{
                console.log(error)
            })
            // console.log(" after register data",e)
        }
    return (
        <div>
            
            <div className="card-body">
                 <Goback/>
                             <h2 className='text-4xl font-bold my-2'> Create Account </h2>
                        <p className=''>Register with ZapShift</p>
                    <form onSubmit={handleSubmit(submitHeandel)} >
                        <fieldset className="fieldset">
                      <label className="label  text-[17px]">Name</label>
                      <input type="name" {...register("name",{required:true, pattern:/^[A-Za-z]+$/i})} className="input lg:w-[380px] rounded-2xl" placeholder="Name" />
                       {errors.name?.type === "required"&&(
                        <p className='text-red-600 '> Name is requrde!! </p>
                      )}
                      <label className="label  text-[17px]">Email</label>
                      <input type="email" {...register("email", {required:true})} className="input lg:w-[380px] rounded-2xl" placeholder="Email" />
                      {errors.email?.type === "required"&&(
                        <p className='text-red-600 '> Name is requrde!! </p>
                      )}
                      <label className="label text-[17px]">Password</label>
                      {/* password */}
                      <input type="password" {...register("password", {required:true , minLength:6})} className="input lg:w-[380px] rounded-2xl" placeholder="Password" />
                      {
                        errors.password?.type ==="required"&&(
                            <p className='text-red-500'>Password is required!! </p>
                        )
                      }
                      
                      <NavLink to="/login"><p className='text-blue-600 hover:underline'> back to Login </p></NavLink>
                     
                      
                      <button className="btn btn-neutral mt-4 lg:w-[380px] rounded-full">Register</button>
                      {/* google btn */}
                      <Google></Google>
                    </fieldset>
                    </form>
                  </div>










         
        </div>
    );
};

export default Register;