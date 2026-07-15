import { useState } from 'react'
import { FaArrowRight, FaGithub, FaInstagram, FaPaperPlane, FaStar } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { NavLink } from 'react-router'
import Swal from 'sweetalert2'
import Logo from '../../../Components/Logo/Logo'
import useAuth from '../../../Hooks/useAuth/useAuth'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'

const socialLinks = [
  {
    label: 'Follow ZapShift on X',
    href: 'https://x.com/',
    icon: FaXTwitter,
  },
  {
    label: 'View ZapShift on GitHub',
    href: 'https://github.com/Antor-Adhikary1216',
    icon: FaGithub,
  },
  {
    label: 'Follow ZapShift on Instagram',
    href: 'https://www.instagram.com/',
    icon: FaInstagram,
  },
]

const Footer = () => {
  const { user } = useAuth()
  const axiosSecure = UseaxiosSecure()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const submitFeedback = async (event) => {
    event.preventDefault()
    setSubmitError('')
    const normalizedComment = comment.trim()

    if (normalizedComment.length < 10) {
      setSubmitError('Please write at least 10 characters.')
      return
    }

    if (normalizedComment.length > 1000) {
      setSubmitError('Feedback cannot exceed 1000 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axiosSecure.post(
        '/feedback',
        {
          name: user?.displayName || '',
          rating,
          comment: normalizedComment,
        },
        { skipGlobalLoading: true },
      )

      setComment('')
      setRating(5)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 2400,
        timerProgressBar: true,
      })
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Unable to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8 sm:mt-10">
      <footer className="overflow-hidden rounded-3xl bg-[#020D0F] text-white shadow-xl shadow-[#03373D]/10">
        <div className="grid gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-12 lg:py-12">
          <div className="flex flex-col">
            <NavLink to="/" aria-label="ZapShift home" className="inline-flex w-fit items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CAEB66]">
              <Logo />
              <span className="text-2xl font-bold sm:text-3xl">ZapShift</span>
            </NavLink>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
              Fast, reliable parcel delivery with clear tracking from pickup to the final doorstep. We keep every shipment simple, visible, and right on time.
            </p>

            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#CAEB66]">Connect with us</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="group flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-xl text-white/75 transition duration-300 hover:-translate-y-1 hover:border-[#CAEB66] hover:bg-[#CAEB66] hover:text-[#03373D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CAEB66] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020D0F]"
                  >
                    <Icon className="transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/60" aria-label="Footer navigation">
              <NavLink to="/aboutUs" className="inline-flex min-h-11 items-center transition hover:text-[#CAEB66]">About us</NavLink>
              <NavLink to="/services" className="inline-flex min-h-11 items-center transition hover:text-[#CAEB66]">Services</NavLink>
              <NavLink to="/Coverags" className="inline-flex min-h-11 items-center transition hover:text-[#CAEB66]">Coverage</NavLink>
              <NavLink to="/bargainnig" className="inline-flex min-h-11 items-center transition hover:text-[#CAEB66]">Pricing</NavLink>
            </nav>
          </div>

          <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 sm:p-7" aria-labelledby="footer-feedback-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#CAEB66]">Your voice matters</p>
                <h2 id="footer-feedback-title" className="mt-2 text-2xl font-bold sm:text-3xl">Share your feedback</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">Tell us what worked well or what we can improve.</p>
              </div>
              <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-[#CAEB66] text-lg text-[#03373D] sm:flex" aria-hidden="true">
                <FaPaperPlane />
              </span>
            </div>

            {user ? (
              <form onSubmit={submitFeedback} className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Submitting as</p>
                  <p className="mt-1 truncate text-sm font-bold text-white">{user.displayName || user.email}</p>
                  {user.displayName && <p className="truncate text-xs text-white/45">{user.email}</p>}
                </div>

                <fieldset>
                  <legend className="text-sm font-semibold text-white/80">How was your experience?</legend>
                  <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Feedback rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={rating === star}
                        aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                        onClick={() => setRating(star)}
                        className={`flex size-11 items-center justify-center rounded-xl text-lg transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CAEB66] ${star <= rating ? 'bg-[#CAEB66] text-[#03373D]' : 'bg-white/8 text-white/30 hover:bg-white/15 hover:text-white/70'}`}
                      >
                        <FaStar aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="website-feedback" className="mb-2 block text-sm font-semibold text-white/80">Your comments</label>
                  <textarea
                    id="website-feedback"
                    rows="4"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    maxLength="1000"
                    required
                    placeholder="Share your experience or suggest an improvement..."
                    className="textarea w-full resize-y rounded-2xl border-white/15 bg-white/8 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-[#CAEB66] focus:outline-none"
                  />
                </div>

                {submitError && <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200" role="alert">{submitError}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#CAEB66] bg-[#CAEB66] px-6 font-bold text-[#03373D] transition duration-300 hover:-translate-y-0.5 hover:bg-[#D8F58A] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? <span className="loading loading-spinner loading-sm" aria-hidden="true" /> : <FaPaperPlane aria-hidden="true" />}
                  Submit feedback
                  {!isSubmitting && <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />}
                </button>
              </form>
            ) : (
              <div className="mt-6 rounded-2xl border border-[#CAEB66]/30 bg-[#CAEB66]/10 p-5">
                <p className="leading-7 text-white/75">Sign in to leave verified feedback and help us improve ZapShift.</p>
                <NavLink to="/login" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#CAEB66] px-5 font-bold text-[#03373D] transition hover:bg-[#D8F58A]">
                  Sign in to comment <FaArrowRight aria-hidden="true" />
                </NavLink>
              </div>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-5 text-center text-xs text-white/45 sm:px-8 md:flex-row md:items-center md:justify-between md:text-left lg:px-12">
          <p>Copyright © {new Date().getFullYear()} ZapShift. All rights reserved.</p>
          <p>Delivering trust, one parcel at a time.</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer
