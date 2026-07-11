import { NavLink, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth/useAuth';
import Google from '../SocialLogin/Google';
import Goback from '../../../Hooks/GootoHomePage/Goback';


const Login = () => {

    const {register, handleSubmit,formState:{errors}} = useForm()
    const {signInuser} =useAuth()
    const navigate = useNavigate()



    // from submiter ->
    const hendelsubmit = (e)=>{
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
            navigate('/', { replace: true })
        })
        .catch(error=>{
            console.log(error)
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
          <input type="email" {...register("email", {required:true})} className="input w-full rounded-2xl" placeholder="Email" />
          {
            errors.email?.type === "required" && <p className='text-red-500'>
                email is unvalid
            </p>
          }
          <label className="label text-[17px]">Password</label>
          {/* password */}
          <input type="password" {...register("password",{required:true, minLength:6 })} className="input w-full rounded-2xl" placeholder="Password" />
          {
            errors.password?.type === "required" && <p className='text-red-500'>
                    Create Password itlist 6 carecters 
            </p>
          }
          <div><a className="link link-hover">Forgot password?</a></div>
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
