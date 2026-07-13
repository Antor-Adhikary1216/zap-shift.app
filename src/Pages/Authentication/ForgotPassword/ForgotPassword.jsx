import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Swal from 'sweetalert2'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'

const ForgotPassword = () => {
  const axiosSecure = UseaxiosSecure()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const prefilledEmail = searchParams.get('email')?.trim().toLowerCase() || ''
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [codeSeconds, setCodeSeconds] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState('email')
  const [message, setMessage] = useState('')
  const [requestError, setRequestError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: prefilledEmail } })

  useEffect(() => {
    if (step !== 'code' || codeSeconds <= 0) return undefined

    const timer = window.setInterval(() => {
      setCodeSeconds((seconds) => Math.max(0, seconds - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [codeSeconds, step])

  const sendCode = async (normalizedEmail) => {
    setIsSending(true)
    setMessage('')
    setRequestError('')

    try {
      const response = await axiosSecure.post('/auth/forgot-password/code', { email: normalizedEmail })
      setEmailAddress(normalizedEmail)
      setStep('code')
      setCodeSeconds(response.data.expiresInSeconds || 60)
      setMessage(response.data.message)
    } catch (error) {
      setRequestError(error.response?.data?.message || 'We could not send the verification code. Try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleReset = async ({ email }) => sendCode(email.trim().toLowerCase())

  const handleCodeVerification = async (event) => {
    event.preventDefault()
    const code = new FormData(event.currentTarget).get('code')?.toString().trim() || ''
    if (!/^\d{6}$/.test(code)) {
      setRequestError('Enter the complete 6-digit code.')
      return
    }

    if (codeSeconds <= 0) {
      setRequestError('This verification code has expired. Request a new code.')
      return
    }

    setIsVerifying(true)
    setRequestError('')
    setMessage('')
    try {
      const response = await axiosSecure.post('/auth/forgot-password/verify', { email: emailAddress, code })
      setResetToken(response.data.resetToken)
      setStep('password')
      setMessage(response.data.message)
    } catch (error) {
      setRequestError(error.response?.data?.message || 'The code could not be verified.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handlePasswordReset = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newPassword = formData.get('newPassword')?.toString() || ''
    const confirmPassword = formData.get('confirmPassword')?.toString() || ''

    if (newPassword.length < 6) {
      setRequestError('Create a password with at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setRequestError('The passwords do not match.')
      return
    }

    setIsResetting(true)
    setRequestError('')
    setMessage('')

    try {
      const response = await axiosSecure.post('/auth/forgot-password/reset', {
        email: emailAddress,
        resetToken,
        newPassword,
      })
      setResetToken('')
      setStep('complete')
      setMessage(response.data.message)
      await Swal.fire({
        icon: 'success',
        title: 'Password reset successfully',
        text: 'You can now log in using your new password.',
        confirmButtonText: 'Return to login',
        confirmButtonColor: '#03373D',
      })
      navigate('/login', { replace: true })
    } catch (error) {
      setRequestError(error.response?.data?.message || 'The password could not be changed. Try again.')
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-md px-0 sm:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#111111] sm:text-[44px]">Forgot Password</h1>
      <p className="mt-3 max-w-sm leading-6 text-[#404040]">
        Enter your email address and we&apos;ll send you a 6-digit verification code.
      </p>

      {step === 'email' && <form onSubmit={handleSubmit(handleReset)} className="mt-7" noValidate>
        <label htmlFor="reset-email" className="mb-2 block text-sm font-semibold text-[#303030]">Email</label>
        <input
          id="reset-email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          aria-invalid={Boolean(errors.email)}
          {...register('email', {
            required: 'Email is required.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address.',
            },
          })}
          className={`h-12 w-full rounded-md border bg-white px-4 outline-none transition focus:border-[#9fc22e] focus:ring-2 focus:ring-[#caeb66]/35 ${errors.email ? 'border-red-500' : 'border-[#CBD5E1]'}`}
        />
        {errors.email && <p className="mt-2 text-sm font-medium text-red-600" role="alert">{errors.email.message}</p>}

        <button
          type="submit"
          disabled={isSending}
          className="mt-5 h-12 w-full rounded-md border-0 bg-[#CAEB66] font-bold text-[#172126] transition hover:bg-[#b9dc50] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? 'Sending...' : 'Send code'}
        </button>
      </form>}

      {step === 'code' && (
        <form onSubmit={handleCodeVerification} className="mt-7">
          <label htmlFor="reset-code" className="mb-2 block text-sm font-semibold text-[#303030]">Verification code</label>
          <input
            id="reset-code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength="6"
            pattern="[0-9]{6}"
            placeholder="Enter 6-digit code"
            className="h-12 w-full rounded-md border border-[#CBD5E1] bg-white px-4 text-center text-xl font-bold tracking-[0.35em] outline-none transition focus:border-[#9fc22e] focus:ring-2 focus:ring-[#caeb66]/35"
          />
          <p className={`mt-3 text-center text-sm font-semibold ${codeSeconds > 0 ? 'text-[#526414]' : 'text-red-600'}`} role="timer">
            {codeSeconds > 0 ? `Code expires in 00:${String(codeSeconds).padStart(2, '0')}` : 'Code expired'}
          </p>
          <button type="submit" disabled={isVerifying || codeSeconds <= 0} className="mt-5 h-12 w-full rounded-md border-0 bg-[#CAEB66] font-bold text-[#172126] transition hover:bg-[#b9dc50] disabled:opacity-60">
            {isVerifying ? 'Verifying...' : 'Verify code'}
          </button>
          {codeSeconds <= 0 && (
            <button type="button" disabled={isSending} onClick={() => sendCode(emailAddress)} className="mt-3 w-full text-sm font-semibold text-[#77951d] hover:underline disabled:opacity-60">
              {isSending ? 'Sending...' : 'Send a new code'}
            </button>
          )}
          <button type="button" onClick={() => { setStep('email'); setMessage(''); setRequestError('') }} className="mt-3 w-full text-sm font-semibold text-[#77951d] hover:underline">
            Use a different email
          </button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={handlePasswordReset} className="mt-7">
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="font-bold text-green-800">Email verified</p>
            <p className="mt-1 text-sm text-green-700">Now create a new password for your account.</p>
          </div>
          <label htmlFor="new-password" className="mb-2 block text-sm font-semibold text-[#303030]">New password</label>
          <div className="relative">
            <input
              id="new-password"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength="6"
              required
              placeholder="At least 6 characters"
              className="h-12 w-full rounded-md border border-[#CBD5E1] bg-white px-4 pr-12 outline-none transition focus:border-[#9fc22e] focus:ring-2 focus:ring-[#caeb66]/35"
            />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#606060]" aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <label htmlFor="confirm-password" className="mb-2 mt-4 block text-sm font-semibold text-[#303030]">Confirm new password</label>
          <div className="relative">
            <input
              id="confirm-password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength="6"
              required
              placeholder="Enter the password again"
              className="h-12 w-full rounded-md border border-[#CBD5E1] bg-white px-4 pr-12 outline-none transition focus:border-[#9fc22e] focus:ring-2 focus:ring-[#caeb66]/35"
            />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#606060]" aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" disabled={isResetting} className="mt-5 h-12 w-full rounded-md border-0 bg-[#CAEB66] font-bold text-[#172126] transition hover:bg-[#b9dc50] disabled:opacity-60">
            {isResetting ? 'Changing password...' : 'Change password'}
          </button>
        </form>
      )}

      {step === 'complete' && (
        <div className="mt-7 rounded-xl border border-green-200 bg-green-50 p-5 text-center">
          <p className="font-bold text-green-800">Password changed</p>
          <p className="mt-1 text-sm text-green-700">You can now log in using your new password.</p>
        </div>
      )}

      {message && <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700" role="status">{message}</p>}
      {requestError && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">{requestError}</p>}

      <p className="mt-6 text-[#818181]">
        Remember your password?{' '}
        <Link to="/login" className="font-semibold text-[#87a925] hover:underline">Login</Link>
      </p>
    </section>
  )
}

export default ForgotPassword
