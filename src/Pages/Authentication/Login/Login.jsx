import { NavLink, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth/useAuth';
import Google from '../SocialLogin/Google';
import Goback from '../../../Hooks/GootoHomePage/Goback';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/


const Login = () => {

    const {register, handleSubmit,formState:{errors}} = useForm()
    const {signInuser} =useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [loginError, setLoginError] = useState('')
    const [showPassword, setShowPassword] = useState(false)



    // from submiter ->
    const hendelsubmit = (e)=>{
        setLoginError('')
        signInuser(e.email,e.password)
        .then(()=>{
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
                error.code === 'auth/invalid-email'
                    ? 'Please provide a valid email address.'
                    : incorrectPasswordCodes.includes(error.code)
                    ? 'Incorrect password'
                    : 'Unable to log in. Please check your details and try again.'
            )
        })
    }
    return (
        <div>
           
             <div className="card-body mx-auto w-full max-w-md gap-0 px-0 py-0 sm:px-8">
                <Goback/>
                 <h2 className='my-2 text-3xl font-bold leading-tight sm:text-4xl'>Welcome Back</h2>
            <p>Login with ZapShift</p>
        <form onSubmit={handleSubmit(hendelsubmit)} className="mt-4 min-w-0">
            <fieldset className="fieldset min-w-0">
                {/* email */}
          <label className="label  text-[17px]">Email</label>
          <input type="email" autoComplete="email" {...register("email", { required: true, pattern: emailPattern })} className={`input h-12 w-full min-w-0 rounded-2xl text-base ${errors.email ? 'border-red-500' : ''}`} placeholder="Email" />
          {errors.email?.type === 'required' && <p className="text-sm font-medium text-red-600">Email is required.</p>}
          {errors.email?.type === 'pattern' && <p className="text-sm font-medium text-red-600">Please provide a valid email address.</p>}
          <label className="label text-[17px]">Password</label>
          {/* password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register("password",{required:true, minLength:6 })}
              className="input h-12 w-full min-w-0 rounded-2xl pr-12 text-base"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-1 flex w-11 items-center justify-center rounded-full text-[#606060] hover:text-[#03373D]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {
            errors.password?.type === "required" && <p className='text-red-500'>
                    Create Password itlist 6 carecters 
            </p>
          }
          {loginError && <p className="mt-1 text-sm font-semibold text-red-600" role="alert">{loginError}</p>}
          <div className="-my-1 flex flex-wrap items-center gap-x-4">
            <NavLink to="/forgot-password" className="link link-hover inline-flex min-h-11 items-center text-[#77951d]">Forgot password?</NavLink>
            <NavLink to="/register" className="inline-flex min-h-11 items-center text-green-600 hover:underline">Create an account</NavLink>
          </div>
          <button className="btn btn-neutral mt-4 min-h-12 w-full rounded-full">Login</button>
          
          {/* google btn */}
    <Google></Google>
        </fieldset>
        </form>
      </div>
        </div>
    );
};

export default Login;
