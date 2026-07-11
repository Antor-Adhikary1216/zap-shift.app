import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import useAuth from '../../../Hooks/useAuth/useAuth';
import Google from '../SocialLogin/Google';
import Goback from '../../../Hooks/GootoHomePage/Goback';
import axios from 'axios';
import imageUploadIcon from '../../../assets/png/TeamsDwon/image-upload-icon.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';


const Register = () => {
const [imagePreview, setImagePreview] = useState('')
const [showPassword, setShowPassword] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)
const [registrationError, setRegistrationError] = useState('')
const {registerUser,updetedUserProfile} =useAuth()
    const navigate = useNavigate()
    const {register,handleSubmit,
        formState:{errors}
    }=useForm()
    const photoRegister = register("photo", { required: true })

    const handleImagePreview = (event) => {
        photoRegister.onChange(event)
        const image = event.target.files?.[0]
        if (!image) {
            setImagePreview('')
            return
        }

        const reader = new FileReader()
        reader.onload = () => setImagePreview(reader.result)
        reader.readAsDataURL(image)
    }
    // submit function =>

         

        const submitHeandel = async (formData)=>{
            setIsSubmitting(true)
            setRegistrationError('')

            try {
                const profileImage = formData.photo?.[0]
                const imageHostKey = import.meta.env.VITE_image_host
                if (!profileImage) throw new Error('Please select a profile image.')
                if (!imageHostKey) throw new Error('Profile image upload is not configured.')

                const imageData = new FormData()
                imageData.append('image', profileImage)
                const imageResponse = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
                    imageData
                )
                const photoURL = imageResponse.data?.data?.display_url
                if (!photoURL) throw new Error('The profile image could not be uploaded.')

                await registerUser(formData.email.trim(), formData.password)
                await updetedUserProfile({
                    displayName: formData.name.trim(),
                    photoURL,
                })

                await Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Account created successfully',
                    showConfirmButton: false,
                    timer: 2200,
                    timerProgressBar: true,
                })
                navigate('/', { replace: true })
            } catch (error) {
                const firebaseMessages = {
                    'auth/email-already-in-use': 'An account already exists with this email address.',
                    'auth/invalid-email': 'Enter a valid email address.',
                    'auth/weak-password': 'Use a stronger password with at least 6 characters.',
                    'auth/network-request-failed': 'Network error. Check your connection and try again.',
                }
                setRegistrationError(firebaseMessages[error.code] || error.message || 'Registration failed. Please try again.')
            } finally {
                setIsSubmitting(false)
            }
        }
    return (
        <div>
            
            <div className="card-body mx-auto w-full max-w-md px-0 sm:px-8">
                 <Goback/>
                             <h2 className='text-4xl font-bold my-2'> Create Account </h2>
                        <p className=''>Register with ZapShift</p>
                    <form onSubmit={handleSubmit(submitHeandel)} >
                        <fieldset className="fieldset">
                      <label className="label text-[17px]">Profile image</label>
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor="profile-image"
                          className={`group relative flex size-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 bg-[#F1F3F4] transition hover:scale-105 hover:border-[#CAEB66] focus-within:ring-2 focus-within:ring-[#CAEB66] ${errors.photo ? 'border-red-500' : 'border-transparent'}`}
                          title="Upload profile image"
                        >
                          <img
                            src={imagePreview || imageUploadIcon}
                            alt={imagePreview ? 'Selected profile preview' : 'Upload profile image'}
                            className={imagePreview ? 'h-full w-full object-cover' : 'h-full w-full object-contain'}
                          />
                          <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            {...photoRegister}
                            onChange={handleImagePreview}
                            className="sr-only"
                          />
                        </label>
                        <div>
                          <p className="text-sm font-semibold text-[#303030]">Upload your photo <span className="text-red-500">*</span></p>
                          <p className="mt-1 text-xs text-[#777777]">Click the avatar to select an image.</p>
                        </div>
                      </div>
                      {errors.photo && <p className="text-sm font-medium text-red-600">Profile image is required.</p>}
                    
                      <label className="label  text-[17px]">Name</label>
                      <input type="text" {...register("name",{required:true, pattern:/^[A-Za-z][A-Za-z\s'-]*$/i})} className="input w-full rounded-2xl" placeholder="Name" />
                       {errors.name?.type === "required"&&(
                        <p className='text-red-600 '> Name is requrde!! </p>
                      )}
                      <label className="label  text-[17px]">Email</label>
                      <input type="email" {...register("email", {required:true})} className="input w-full rounded-2xl" placeholder="Email" />
                      {errors.email?.type === "required"&&(
                        <p className='text-red-600 '> Name is requrde!! </p>
                      )}
                      <label className="label text-[17px]">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          {...register("password", {required:true , minLength:6})}
                          className="input w-full rounded-2xl pr-12"
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
                        errors.password?.type ==="required"&&(
                            <p className='text-red-500'>Password is required!! </p>
                        )
                      }
                      
                      <NavLink to="/login"><p className='text-blue-600 hover:underline'> back to Login </p></NavLink>
                     
                      
                      {registrationError && <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">{registrationError}</p>}

                      <button disabled={isSubmitting} className="btn btn-neutral mt-4 w-full rounded-full disabled:opacity-60">
                        {isSubmitting ? 'Creating account...' : 'Register'}
                      </button>
                      {/* google btn */}
                      <Google></Google>
                    </fieldset>
                    </form>
                  </div>










         
        </div>
    );
};

export default Register;
