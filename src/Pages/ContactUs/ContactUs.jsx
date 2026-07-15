import { useState } from 'react'
import axios from 'axios'
import {
  FaArrowRight,
  FaBoxOpen,
  FaChevronDown,
  FaCreditCard,
  FaHeadset,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaPaperPlane,
  FaRegCheckCircle,
} from 'react-icons/fa'
import { NavLink } from 'react-router'
import Swal from 'sweetalert2'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const helpLinks = [
  {
    icon: FaBoxOpen,
    title: 'My parcels',
    description: 'Review parcel details and your recent bookings.',
    to: '/dashbord/my-parcels',
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Track a parcel',
    description: 'Check the latest delivery status using your tracking ID.',
    to: '/dashbord/track-parcel',
  },
  {
    icon: FaCreditCard,
    title: 'Payment help',
    description: 'Review payments and transaction details in one place.',
    to: '/dashbord/payment-history',
  },
  {
    icon: FaMotorcycle,
    title: 'Rider support',
    description: 'Learn about becoming a ZapShift delivery partner.',
    to: '/bearider',
  },
]

const faqs = [
  {
    question: 'How can I track my parcel?',
    answer: 'Open Track a parcel from your dashboard and enter the tracking ID provided when the parcel was created.',
  },
  {
    question: 'Why is my payment still showing as pending?',
    answer: 'A payment can remain pending until the provider confirms it. Check your payment history first, then send us the parcel or transaction details if it does not update.',
  },
  {
    question: 'Can I ask for help if I cannot log in?',
    answer: 'Yes. This Contact Us page is public, so you can submit a support ticket even when you are unable to access your account.',
  },
  {
    question: 'What information should I include?',
    answer: 'Describe what happened and include your tracking ID when the question is about a parcel. Never include your password or payment card details.',
  },
]

const initialForm = {
  name: '',
  email: '',
  category: 'parcel',
  trackingId: '',
  message: '',
}

const ContactUs = () => {
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrorMessage('')
  }

  const submitRequest = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (form.name.trim().length < 2) {
      setErrorMessage('Please provide your full name.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      setErrorMessage('Please provide a valid email address.')
      return
    }

    if (form.message.trim().length < 20) {
      setErrorMessage('Please describe the problem using at least 20 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post(`${apiUrl}/support-requests`, {
        name: form.name.trim(),
        email: form.email.trim(),
        category: form.category,
        trackingId: form.trackingId.trim(),
        message: form.message.trim(),
      })

      await Swal.fire({
        icon: 'success',
        title: 'Support request received',
        html: `Your ticket ID is <strong>${response.data.ticketId}</strong>.<br />Keep it for your records.`,
        confirmButtonText: 'Done',
        confirmButtonColor: '#03373D',
      })

      setForm((current) => ({
        ...initialForm,
        name: current.name,
        email: current.email,
      }))
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to submit your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="my-6 overflow-hidden rounded-3xl bg-white shadow-sm sm:my-10">
      <section className="relative overflow-hidden bg-[#03373D] px-5 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="absolute -left-20 -top-20 size-64 rounded-full border-[44px] border-white/5" />
        <div className="absolute -bottom-28 right-10 size-72 rounded-full bg-[#CAEB66]/10 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#CAEB66]">Contact ZapShift</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] min-[420px]:text-5xl sm:text-6xl lg:text-7xl">
              Help is just a message away.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              Find a quick answer or send our support team the details. You can request help here even if you cannot log in.
            </p>
            <a href="#support-form" className="btn mt-8 min-h-12 w-full rounded-xl border-[#CAEB66] bg-[#CAEB66] px-7 text-[#03373D] hover:border-[#B8DD4E] hover:bg-[#B8DD4E] sm:w-auto">
              Create a support ticket <FaArrowRight aria-hidden="true" />
            </a>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/[0.06]">
            <div className="absolute inset-7 rounded-[2rem] border border-dashed border-[#CAEB66]/30" />
            <span className="relative flex size-32 items-center justify-center rounded-[2rem] bg-[#CAEB66] text-6xl text-[#03373D] shadow-2xl shadow-black/20 sm:size-40 sm:text-7xl">
              <FaHeadset aria-hidden="true" />
            </span>
            <span className="absolute bottom-6 right-6 flex size-12 items-center justify-center rounded-2xl bg-white text-xl text-[#5F7720] shadow-lg">
              <FaRegCheckCircle aria-hidden="true" />
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F9F9] px-5 py-12 sm:px-10 sm:py-16 lg:px-16" aria-labelledby="quick-help-title">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#789529]">Quick help</p>
          <h2 id="quick-help-title" className="mt-3 text-3xl font-bold text-[#03373D] sm:text-4xl">Go straight to what you need</h2>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {helpLinks.map(({ icon: Icon, title, description, to }) => (
            <NavLink key={title} to={to} className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#CAEB66] hover:shadow-xl hover:shadow-[#03373D]/5">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EEF6D8] text-xl text-[#5F7720] transition group-hover:bg-[#CAEB66]">
                <Icon aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-[#03373D]">{title}</h3>
              <p className="mt-3 leading-7 text-[#606060]">{description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#5F7720]">Open <FaArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </NavLink>
          ))}
        </div>
      </section>

      <section className="grid gap-12 px-5 py-12 sm:px-10 sm:py-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:px-16">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#789529]">Common questions</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-[#03373D] sm:text-4xl">Answers before you ask</h2>
          <p className="mt-4 leading-7 text-[#606060]">Try these quick answers first. If the issue continues, send us a ticket with the details.</p>

          <div className="mt-7 space-y-3">
            {faqs.map(({ question, answer }) => (
              <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-[#CAEB66] open:bg-[#FBFDF5]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#03373D]">
                  {question}
                  <FaChevronDown className="shrink-0 text-[#789529] transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-4 border-t border-slate-200 pt-4 leading-7 text-[#606060]">{answer}</p>
              </details>
            ))}
          </div>
        </div>

        <section id="support-form" className="scroll-mt-24 rounded-3xl bg-[#03373D] p-5 text-white shadow-xl shadow-[#03373D]/10 sm:p-8" aria-labelledby="support-form-title">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#CAEB66]">Still need help?</p>
              <h2 id="support-form-title" className="mt-2 text-3xl font-bold">Create a support ticket</h2>
              <p className="mt-3 leading-7 text-white/65">Tell us what happened and we will keep your request in our support queue.</p>
            </div>
            <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-[#CAEB66] text-xl text-[#03373D] sm:flex">
              <FaPaperPlane aria-hidden="true" />
            </span>
          </div>

          <form onSubmit={submitRequest} className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Full name
                <input name="name" value={form.name} onChange={updateField} minLength="2" maxLength="100" required autoComplete="name" placeholder="Your full name" className="min-h-12 rounded-xl border border-white/15 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/35 focus:border-[#CAEB66] focus:ring-2 focus:ring-[#CAEB66]/20" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Email address
                <input type="email" name="email" value={form.email} onChange={updateField} required autoComplete="email" placeholder="you@example.com" className="min-h-12 rounded-xl border border-white/15 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/35 focus:border-[#CAEB66] focus:ring-2 focus:ring-[#CAEB66]/20" />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Help topic
                <select name="category" value={form.category} onChange={updateField} className="min-h-12 rounded-xl border border-white/15 bg-[#17484E] px-4 text-base text-white outline-none focus:border-[#CAEB66] focus:ring-2 focus:ring-[#CAEB66]/20">
                  <option value="parcel">Parcel delivery</option>
                  <option value="tracking">Tracking</option>
                  <option value="payment">Payment</option>
                  <option value="account">Account or login</option>
                  <option value="rider">Rider application</option>
                  <option value="other">Something else</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Tracking ID <span className="font-normal text-white/45">(optional)</span>
                <input name="trackingId" value={form.trackingId} onChange={updateField} maxLength="60" placeholder="e.g. ZP..." className="min-h-12 rounded-xl border border-white/15 bg-white/10 px-4 text-base uppercase text-white outline-none placeholder:normal-case placeholder:text-white/35 focus:border-[#CAEB66] focus:ring-2 focus:ring-[#CAEB66]/20" />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold">
              How can we help?
              <textarea name="message" value={form.message} onChange={updateField} minLength="20" maxLength="1500" required rows="6" placeholder="Describe the problem and what you expected to happen..." className="resize-y rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-base leading-7 text-white outline-none placeholder:text-white/35 focus:border-[#CAEB66] focus:ring-2 focus:ring-[#CAEB66]/20" />
              <span className="text-right text-xs font-normal text-white/40">{form.message.length}/1500</span>
            </label>

            {errorMessage && <p role="alert" className="rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100">{errorMessage}</p>}

            <button type="submit" disabled={isSubmitting} className="btn min-h-12 w-full rounded-xl border-[#CAEB66] bg-[#CAEB66] px-7 text-[#03373D] hover:border-[#B8DD4E] hover:bg-[#B8DD4E] disabled:border-white/20 disabled:bg-white/20 disabled:text-white/50 sm:w-auto">
              {isSubmitting ? <><span className="loading loading-spinner loading-sm" /> Sending request...</> : <>Send request <FaPaperPlane aria-hidden="true" /></>}
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

export default ContactUs
