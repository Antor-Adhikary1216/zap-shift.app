import { NavLink, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth/useAuth';
import Google from '../SocialLogin/Google';
import Goback from '../../../Hooks/GootoHomePage/Goback';
import { useState } from 'react';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/


const Login = () => {

    const {register, handleSubmit,formState:{errors}} = useForm()
    const {signInuser} =useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [loginError, setLoginError] = useState('')



    // from submiter ->
    const hendelsubmit = (e)=>{
        setLoginError('')
        signInuser(e.email,e.password)
        .then(res=>{
            console.log(res.user)
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Logged in successfully',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            })
            navigate(location.state?.from || '/', { replace: true })
        })
        .catch(error=>{
            const incorrectPasswordCodes = ['auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-login-credentials']
            setLoginError(
                error.code === 'auth/email-not-verified'
                    ? error.message
                    : error.code === 'auth/invalid-email'
                    ? 'Please provide a valid email address.'
                    : incorrectPasswordCodes.includes(error.code)
                    ? 'Incorrect password'
                    : 'Unable to log in. Please check your details and try again.'
            )
        })
        // console.log("logindata", e)
    }
    return (
        <div>
           
             <div className="card-body mx-auto w-full max-w-md px-0 sm:px-8">
                <Goback/>
                 <h2 className='text-4xl font-bold my-2'> Welcome Back</h2>
            <p className=''>Login with ZapShift</p>
        <form onSubmit={handleSubmit(hendelsubmit)} >
            <fieldset className="fieldset">
                {/* email */}
          <label className="label  text-[17px]">Email</label>
          <input type="email" {...register("email", { required: true, pattern: emailPattern })} className={`input w-full rounded-2xl ${errors.email ? 'border-red-500' : ''}`} placeholder="Email" />
          {errors.email?.type === 'required' && <p className="text-sm font-medium text-red-600">Email is required.</p>}
          {errors.email?.type === 'pattern' && <p className="text-sm font-medium text-red-600">Please provide a valid email address.</p>}
          <label className="label text-[17px]">Password</label>
          {/* password */}
          <input type="password" {...register("password",{required:true, minLength:6 })} className="input w-full rounded-2xl" placeholder="Password" />
          {
            errors.password?.type === "required" && <p className='text-red-500'>
                    Create Password itlist 6 carecters 
            </p>
          }
          {loginError && <p className="mt-1 text-sm font-semibold text-red-600" role="alert">{loginError}</p>}
          <div><NavLink to="/forgot-password" className="link link-hover text-[#77951d]">Forgot password?</NavLink></div>
          <NavLink to="/register"><p className='text-green-600 hover:underline'>Create a account</p></NavLink>
          <button className="btn btn-neutral mt-4 w-full rounded-full">Login</button>
          
          {/* google btn */}
    <Google></Google>
        </fieldset>
        </form>
      </div>
        </div>
    );
};

export default Login;
