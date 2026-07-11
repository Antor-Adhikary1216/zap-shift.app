import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'

const ForgotPassword = () => {
  const axiosSecure = UseaxiosSecure()
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  const [step, setStep] = useState('email')
  const [message, setMessage] = useState('')
  const [requestError, setRequestError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleReset = async ({ email }) => {
    setIsSending(true)
    setMessage('')
    setRequestError('')

    try {
      const normalizedEmail = email.trim().toLowerCase()
      const response = await axiosSecure.post('/auth/forgot-password/code', { email: normalizedEmail })
      setEmailAddress(normalizedEmail)
      setStep('code')
      setMessage(response.data.message)
    } catch (error) {
      setRequestError(error.response?.data?.message || 'We could not send the verification code. Try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleCodeVerification = async (event) => {
    event.preventDefault()
    const code = new FormData(event.currentTarget).get('code')?.toString().trim() || ''
    if (!/^\d{6}$/.test(code)) {
      setRequestError('Enter the complete 6-digit code.')
      return
    }

    setIsVerifying(true)
    setRequestError('')
    setMessage('')
    try {
      const response = await axiosSecure.post('/auth/forgot-password/verify', { email: emailAddress, code })
      setStep('verified')
      setMessage(response.data.message)
    } catch (error) {
      setRequestError(error.response?.data?.message || 'The code could not be verified.')
    } finally {
      setIsVerifying(false)
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
          <button type="submit" disabled={isVerifying} className="mt-5 h-12 w-full rounded-md border-0 bg-[#CAEB66] font-bold text-[#172126] transition hover:bg-[#b9dc50] disabled:opacity-60">
            {isVerifying ? 'Verifying...' : 'Verify code'}
          </button>
          <button type="button" onClick={() => { setStep('email'); setMessage(''); setRequestError('') }} className="mt-3 w-full text-sm font-semibold text-[#77951d] hover:underline">
            Use a different email
          </button>
        </form>
      )}

      {step === 'verified' && (
        <div className="mt-7 rounded-xl border border-green-200 bg-green-50 p-5 text-center">
          <p className="font-bold text-green-800">Email verified</p>
          <p className="mt-1 text-sm text-green-700">Your verification code was accepted successfully.</p>
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
