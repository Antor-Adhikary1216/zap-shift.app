import React from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router';

const Register = () => {

    const {register,handleSubmit,
        formState:{errors}
    }=useForm()
    // submit function =>
        const submitHeandel = (e)=>{
            
            console.log(" after register data",e)
        }
    return (
        <div>
            
            <div className="card-body">
                             <h2 className='text-4xl font-bold my-2'> Welcome Back</h2>
                        <p className=''>Login with ZapShift</p>
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
                      <div><a className="link link-hover">Forgot password?</a></div>
                      <NavLink to="/login"><p> back to Login </p></NavLink>
                     
                      
                      <button className="btn btn-neutral mt-4 lg:w-[380px] rounded-full">Login</button>
                      {/* google btn */}
                      <button className="btn lg:w-[380px] mt-5 rounded-full bg-[#C2C2C2] text-black border-[#e5e5e5]">
              <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
              Login with Google
            </button>
                    </fieldset>
                    </form>
                  </div>










         
        </div>
    );
};

export default Register;