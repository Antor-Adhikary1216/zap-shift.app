import {
  FaArrowRight,
  FaBoxOpen,
  FaClock,
  FaHeart,
  FaMapMarkedAlt,
  FaRoute,
  FaShieldAlt,
} from 'react-icons/fa'
import { NavLink } from 'react-router'
import deliveryPartner from '../../assets/png/big-deliveryman.png'

const values = [
  {
    icon: FaClock,
    title: 'Reliable by design',
    description: 'Clear delivery windows and dependable operations keep every shipment moving on schedule.',
  },
  {
    icon: FaMapMarkedAlt,
    title: 'Visible at every step',
    description: 'Real-time tracking gives senders and receivers confidence from pickup to delivery.',
  },
  {
    icon: FaShieldAlt,
    title: 'Handled with care',
    description: 'Every parcel matters, so safe handling stays at the heart of the way we work.',
  },
  {
    icon: FaHeart,
    title: 'People come first',
    description: 'Helpful support and a simple experience make delivery easier for customers and riders.',
  },
]

const journey = [
  {
    number: '01',
    title: 'Book in minutes',
    description: 'Share the pickup, destination, and parcel details through one simple booking flow.',
  },
  {
    number: '02',
    title: 'We move it safely',
    description: 'A delivery partner collects your parcel and keeps it moving through our network.',
  },
  {
    number: '03',
    title: 'Track to the door',
    description: 'Follow the journey and receive clear updates until the parcel reaches its destination.',
  },
]

const AboutUS = () => {
  return (
    <main className="my-6 overflow-hidden rounded-3xl bg-white shadow-sm sm:my-10">
      <section className="relative overflow-hidden bg-[#03373D] px-5 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="absolute -left-24 -top-24 size-72 rounded-full border-[48px] border-white/5" />
        <div className="absolute -bottom-24 right-1/3 size-64 rounded-full bg-[#CAEB66]/10 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#CAEB66]">About ZapShift</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] min-[420px]:text-5xl sm:text-6xl lg:text-7xl">
              Moving India, one trusted delivery at a time.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              ZapShift connects people, businesses, and delivery partners through a faster, clearer, and more dependable parcel experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <NavLink
                to="/send_a_parcel"
                className="btn min-h-12 w-full rounded-xl border-[#CAEB66] bg-[#CAEB66] px-7 text-[#03373D] hover:border-[#B8DD4E] hover:bg-[#B8DD4E] sm:w-auto"
              >
                Send a parcel <FaArrowRight />
              </NavLink>
              <NavLink
                to="/bearider"
                className="btn min-h-12 w-full rounded-xl border-white/30 bg-transparent px-7 text-white hover:border-white hover:bg-white hover:text-[#03373D] sm:w-auto"
              >
                Join as a rider
              </NavLink>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-md items-end justify-center rounded-[2rem] bg-white/8 px-5 pt-8 ring-1 ring-white/10 sm:px-8">
            <div className="absolute right-5 top-5 rounded-2xl bg-[#CAEB66] px-4 py-3 text-[#03373D] shadow-xl sm:right-7 sm:top-7">
              <p className="text-xs font-bold uppercase tracking-wider">Our promise</p>
              <p className="mt-1 font-bold">Right on time</p>
            </div>
            <img
              src={deliveryPartner}
              alt="ZapShift delivery partner carrying parcels"
              className="relative mt-14 w-full max-w-sm object-contain"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      <section className="grid border-b border-slate-200 bg-[#F7FAEE] sm:grid-cols-3">
        <div className="border-b border-slate-200 px-5 py-7 text-center sm:border-b-0 sm:border-r sm:px-8">
          <p className="text-3xl font-bold text-[#03373D] sm:text-4xl">79</p>
          <p className="mt-1 text-sm font-semibold text-[#606060]">Districts in our coverage data</p>
        </div>
        <div className="border-b border-slate-200 px-5 py-7 text-center sm:border-b-0 sm:border-r sm:px-8">
          <p className="text-3xl font-bold text-[#03373D] sm:text-4xl">24/7</p>
          <p className="mt-1 text-sm font-semibold text-[#606060]">Tracking and customer support</p>
        </div>
        <div className="px-5 py-7 text-center sm:px-8">
          <p className="text-3xl font-bold text-[#03373D] sm:text-4xl">1-3 days</p>
          <p className="mt-1 text-sm font-semibold text-[#606060]">Standard delivery window</p>
        </div>
      </section>

      <section className="grid gap-10 px-5 py-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-16">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#789529]">Our story</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-[#03373D] sm:text-4xl lg:text-5xl">
            Delivery should feel simple, not uncertain.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-[#606060] sm:text-lg sm:leading-8">
            <p>
              ZapShift began with a straightforward idea: make it easier to send a parcel and know exactly what happens next. No confusing steps, no missing updates, and no unnecessary waiting.
            </p>
            <p>
              Today, we are building a delivery network for everyday senders and growing businesses, supported by local riders and technology that keeps every journey visible.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-[#03373D] p-6 text-white sm:p-9">
          <div className="absolute -right-14 -top-14 size-44 rounded-full border-[30px] border-white/5" />
          <span className="relative flex size-14 items-center justify-center rounded-2xl bg-[#CAEB66] text-2xl text-[#03373D]">
            <FaRoute />
          </span>
          <p className="relative mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#CAEB66]">Our mission</p>
          <h3 className="relative mt-3 text-2xl font-bold leading-snug sm:text-3xl">
            Make dependable delivery accessible to every person and every business.
          </h3>
          <p className="relative mt-5 leading-7 text-white/70">
            We combine local reach, responsible delivery partners, and useful technology to create a service people can trust every day.
          </p>
        </div>
      </section>

      <section className="bg-[#F7F9F9] px-5 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#789529]">What guides us</p>
          <h2 className="mt-3 text-3xl font-bold text-[#03373D] sm:text-4xl">The values behind every delivery</h2>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {values.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#CAEB66] hover:shadow-xl hover:shadow-[#03373D]/5">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EEF6D8] text-xl text-[#5F7720]">
                <Icon />
              </span>
              <h3 className="mt-5 text-xl font-bold text-[#03373D]">{title}</h3>
              <p className="mt-3 leading-7 text-[#606060]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#789529]">The ZapShift journey</p>
          <h2 className="mt-3 text-3xl font-bold text-[#03373D] sm:text-4xl">From your hands to their door</h2>
        </div>

        <div className="relative mt-10 grid gap-5 md:grid-cols-3">
          {journey.map(({ number, title, description }) => (
            <article key={number} className="relative rounded-2xl border border-slate-200 p-6 sm:p-7">
              <span className="text-5xl font-black text-[#E5F3BC]">{number}</span>
              <h3 className="mt-4 text-xl font-bold text-[#03373D]">{title}</h3>
              <p className="mt-3 leading-7 text-[#606060]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-5 mb-12 overflow-hidden rounded-3xl bg-[#CAEB66] px-5 py-9 sm:mx-10 sm:px-10 sm:py-11 lg:mx-16 lg:mb-16 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12">
        <div className="flex items-start gap-4">
          <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-[#03373D] text-xl text-white sm:flex">
            <FaBoxOpen />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#52671B]">Ready when you are</p>
            <h2 className="mt-2 text-3xl font-bold text-[#03373D]">Let us move what matters to you.</h2>
            <p className="mt-3 max-w-2xl text-[#405255]">Book a pickup, follow the journey, and leave the delivery to ZapShift.</p>
          </div>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0">
          <NavLink to="/services" className="btn w-full rounded-xl border-[#03373D] bg-transparent text-[#03373D] hover:bg-[#03373D] hover:text-white sm:w-auto">
            Explore services
          </NavLink>
          <NavLink to="/send_a_parcel" className="btn w-full rounded-xl border-[#03373D] bg-[#03373D] text-white hover:border-[#0A4A52] hover:bg-[#0A4A52] sm:w-auto">
            Send a parcel <FaArrowRight />
          </NavLink>
        </div>
      </section>
    </main>
  )
}

export default AboutUS
