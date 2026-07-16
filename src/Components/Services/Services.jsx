import { FaArrowRight, FaBoxOpen, FaBriefcase, FaClock, FaGlobeAsia, FaMapMarkedAlt, FaShieldAlt } from 'react-icons/fa'
import { NavLink } from 'react-router'

const services = [
  {
    icon: FaClock,
    title: 'Express Delivery',
    description: 'Same-day and next-day delivery for parcels that simply cannot wait.',
    tag: '4-24 hours',
  },
  {
    icon: FaBoxOpen,
    title: 'Standard Delivery',
    description: 'A dependable, affordable option for everyday parcels across the country.',
    tag: '1-3 days',
  },
  {
    icon: FaBriefcase,
    title: 'Business Delivery',
    description: 'Flexible pickup schedules and delivery support built for growing businesses.',
    tag: 'For merchants',
  },
  {
    icon: FaGlobeAsia,
    title: 'Nationwide Shipping',
    description: 'Send parcels beyond your city with our expanding nationwide delivery network.',
    tag: '64 districts',
  },
  {
    icon: FaMapMarkedAlt,
    title: 'Live Parcel Tracking',
    description: 'Follow every important movement from pickup to the customer’s doorstep.',
    tag: 'Real-time updates',
  },
  {
    icon: FaShieldAlt,
    title: 'Secure Handling',
    description: 'Careful handling and reliable delivery processes keep every shipment protected.',
    tag: 'Safe & reliable',
  },
]

const Services = () => {
  return (
    <main className="my-6 overflow-hidden rounded-3xl bg-white shadow-sm sm:my-10">
      <section className="relative overflow-hidden bg-[#03373D] px-5 py-14 text-white sm:px-10 lg:px-16 lg:py-20">
        <div className="absolute -right-20 -top-20 size-64 rounded-full border-[45px] border-white/5" />
        <div className="absolute -bottom-28 right-1/4 size-56 rounded-full bg-[#c5ed58]/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#c5ed58]">What we deliver</p>
          <h1 className="text-3xl font-bold leading-tight min-[380px]:text-4xl sm:text-5xl lg:text-6xl">
            Delivery services made for every journey
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            From a single document to daily business orders, ZapShift gives you fast pickup, careful handling, and clear tracking all the way.
          </p>
          <NavLink to="/send_a_parcel" className="btn mt-8 h-13 rounded-xl border-[#c5ed58] bg-[#c5ed58] px-7 text-base text-[#03373D] hover:border-[#b4dd45] hover:bg-[#b4dd45]">
            Send a parcel <FaArrowRight />
          </NavLink>
        </div>
      </section>

      <section className="px-4 py-10 min-[380px]:px-5 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8aa82f]">Our solutions</p>
            <h2 className="mt-2 text-3xl font-bold text-[#03373D] sm:text-4xl">Choose the service you need</h2>
          </div>
          <p className="max-w-md leading-7 text-[#606060]">Simple options, honest delivery times, and support whenever you need it.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, description, tag }) => (
            <article key={title} className="group rounded-2xl border border-slate-200 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#c5ed58] hover:shadow-xl hover:shadow-[#03373D]/5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-13 items-center justify-center rounded-2xl bg-[#eef6d8] text-xl text-[#5f7720] transition group-hover:bg-[#c5ed58] group-hover:text-[#03373D]">
                  <Icon />
                </span>
                <span className="rounded-full bg-base-200 px-3 py-1 text-xs font-bold text-[#606060]">{tag}</span>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-[#03373D]">{title}</h3>
              <p className="mt-3 leading-7 text-[#606060]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-4 mb-10 rounded-3xl bg-[#f1f5e8] px-5 py-9 min-[380px]:mx-5 sm:mx-10 sm:px-10 sm:py-10 lg:mx-16 lg:mb-16 lg:flex lg:items-center lg:justify-between lg:px-12">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#71852f]">Ready to get moving?</p>
          <h2 className="mt-2 text-3xl font-bold text-[#03373D]">Your next delivery starts here.</h2>
          <p className="mt-3 text-[#606060]">Book a pickup in minutes and let us handle the rest.</p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
          <NavLink to="/bargainnig" className="btn w-full rounded-xl border-[#03373D] bg-transparent text-[#03373D] hover:bg-[#03373D] hover:text-white sm:w-auto">Check pricing</NavLink>
          <NavLink to="/send_a_parcel" className="btn w-full rounded-xl border-[#03373D] bg-[#03373D] text-white hover:border-[#0a4a52] hover:bg-[#0a4a52] sm:w-auto">Book delivery</NavLink>
        </div>
      </section>
    </main>
  )
}

export default Services
