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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'


const Register = () => {
const [imagePreview, setImagePreview] = useState('')
const [showPassword, setShowPassword] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)
const [submissionStep, setSubmissionStep] = useState('')
const [registrationError, setRegistrationError] = useState('')
const {registerUser,updetedUserProfile,deleteIncompleteRegistration,saveUserToDatabase} =useAuth()
    const navigate = useNavigate()
    const {register,handleSubmit,
        formState:{errors}
    }=useForm()
    const photoRegister = register("photo")

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
            let registration
            let emailVerificationCompleted = false

            try {
                const email = formData.email.trim().toLowerCase()
                setSubmissionStep('Sending verification code...')
                await axios.post(`${apiUrl}/auth/registration/send-code`, { email })

                const codePrompt = await Swal.fire({
                    icon: 'info',
                    title: 'Check your email',
                    text: `Enter the six-digit verification code sent to ${email}.`,
                    input: 'text',
                    inputPlaceholder: 'Six-digit code',
                    inputAttributes: {
                        inputmode: 'numeric',
                        maxlength: '6',
                        autocomplete: 'one-time-code',
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Verify email',
                    confirmButtonColor: '#03373D',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !Swal.isLoading(),
                    preConfirm: async (code) => {
                        if (!/^\d{6}$/.test(String(code || '').trim())) {
                            Swal.showValidationMessage('Enter the six-digit code sent to your email.')
                            return false
                        }

                        try {
                            const response = await axios.post(`${apiUrl}/auth/registration/verify-code`, {
                                email,
                                code: String(code).trim(),
                            })
                            return response.data.verificationToken
                        } catch (error) {
                            Swal.showValidationMessage(error.response?.data?.message || 'Unable to verify this code.')
                            return false
                        }
                    },
                })

                if (!codePrompt.isConfirmed || !codePrompt.value) return

                setSubmissionStep('Creating your account...')
                const profileImage = formData.photo?.[0]
                const imageHostKey = import.meta.env.VITE_image_host
                if (profileImage && !imageHostKey) throw new Error('Profile image upload is not configured.')

                const imageUploadPromise = profileImage
                    ? (() => {
                        const imageData = new FormData()
                        imageData.append('image', profileImage)
                        return axios.post(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, imageData)
                            .then((response) => {
                                const uploadedPhoto = response.data?.data?.display_url
                                if (!uploadedPhoto) throw new Error('The profile image could not be uploaded.')
                                return uploadedPhoto
                            })
                    })()
                    : Promise.resolve('')

                const [imageResult, registrationResult] = await Promise.allSettled([
                    imageUploadPromise,
                    registerUser(email, formData.password),
                ])

                if (registrationResult.status === 'fulfilled') registration = registrationResult.value
                if (registrationResult.status === 'rejected') throw registrationResult.reason
                if (imageResult.status === 'rejected') throw imageResult.reason

                const photoURL = imageResult.value
                const idToken = await registration.user.getIdToken()
                const [profileResult, verificationResult] = await Promise.allSettled([
                    updetedUserProfile({ displayName: formData.name.trim(), photoURL }),
                    axios.post(
                        `${apiUrl}/auth/registration/complete`,
                        { verificationToken: codePrompt.value },
                        { headers: { Authorization: `Bearer ${idToken}` } }
                    ),
                ])

                if (verificationResult.status === 'fulfilled') emailVerificationCompleted = true
                if (verificationResult.status === 'rejected') throw verificationResult.reason
                if (profileResult.status === 'rejected') throw profileResult.reason

                await registration.user.reload()
                await registration.user.getIdToken(true)
                await saveUserToDatabase(registration.user, 'register')

                await Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Email verified and account created',
                    showConfirmButton: false,
                    timer: 2400,
                    timerProgressBar: true,
                })
                navigate('/', { replace: true })
            } catch (error) {
                if (registration?.user && !emailVerificationCompleted) {
                    await deleteIncompleteRegistration(registration.user).catch(() => {})
                }
                const firebaseMessages = {
                    'auth/email-already-in-use': 'An account already exists with this email address.',
                    'auth/invalid-email': 'Please provide a valid email address.',
                    'auth/weak-password': 'Use a stronger password with at least 6 characters.',
                    'auth/network-request-failed': 'Network error. Check your connection and try again.',
                }
                setRegistrationError(
                    firebaseMessages[error.code]
                    || error.response?.data?.message
                    || error.message
                    || 'Registration failed. Please try again.'
                )
            } finally {
                setIsSubmitting(false)
                setSubmissionStep('')
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
                          className="group relative flex size-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-transparent bg-[#F1F3F4] transition hover:scale-105 hover:border-[#CAEB66] focus-within:ring-2 focus-within:ring-[#CAEB66]"
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
                          <p className="text-sm font-semibold text-[#303030]">Upload your photo <span className="font-normal text-[#777777]">(optional)</span></p>
                          <p className="mt-1 text-xs text-[#777777]">Skip this now and add a photo later.</p>
                        </div>
                      </div>
                    
                      <label className="label  text-[17px]">Name</label>
                      <input type="text" {...register("name",{required:true, pattern:/^[A-Za-z][A-Za-z\s'-]*$/i})} className="input w-full rounded-2xl" placeholder="Name" />
                       {errors.name?.type === "required"&&(
                        <p className='text-red-600 '> Name is requrde!! </p>
                      )}
                      <label className="label  text-[17px]">Email</label>
                      <input type="email" {...register("email", { required: true, pattern: emailPattern })} className={`input w-full rounded-2xl ${errors.email ? 'border-red-500' : ''}`} placeholder="Email" />
                      {errors.email?.type === 'required' && <p className="text-sm font-medium text-red-600">Email is required.</p>}
                      {errors.email?.type === 'pattern' && <p className="text-sm font-medium text-red-600">Please provide a valid email address.</p>}
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
                        {isSubmitting ? submissionStep : 'Register'}
                      </button>
                      {/* google btn */}
                      <Google
                        mode="register"
                        onError={setRegistrationError}
                      />
                    </fieldset>
                    </form>
                  </div>










         
        </div>
    );
};

export default Register;
