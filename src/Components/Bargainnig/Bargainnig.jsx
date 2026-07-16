import { useState } from 'react'
import { FaCalculator } from 'react-icons/fa'

const INITIAL_FORM = {
  parcelType: '',
  destination: '',
  weight: '',
}

const calculateDeliveryCost = ({ parcelType, destination, weight }) => {
  const isSameDistrict = destination === 'same-district'

  if (parcelType === 'document') {
    return isSameDistrict ? 69 : 99
  }

  const parcelWeight = Number(weight)
  const minimumCharge = isSameDistrict ? 119 : 149

  if (parcelWeight < 3) return minimumCharge

  const extraWeight = parcelWeight - 3
  const extraCharge = isSameDistrict
    ? extraWeight * 40
    : extraWeight * 40 + 20

  return minimumCharge + extraCharge
}

const Bargainnig = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [cost, setCost] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  const handleCalculate = (event) => {
    event.preventDefault()

    if (!form.parcelType || !form.destination) {
      setError('Select a parcel type and delivery destination.')
      return
    }

    if (form.parcelType === 'non-document' && (!form.weight || Number(form.weight) <= 0)) {
      setError('Enter a valid parcel weight.')
      return
    }

    setCost(calculateDeliveryCost(form))
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setCost(null)
    setError('')
  }

  return (
    <section className="my-5 overflow-hidden rounded-3xl bg-white px-4 py-9 shadow-sm min-[380px]:px-5 sm:px-10 sm:py-10 lg:px-16 lg:py-16">
      <div className="max-w-4xl">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#8bad28]">
          <FaCalculator /> Quick estimate
        </p>
        <h1 className="text-3xl font-bold text-[#03373D] min-[380px]:text-4xl sm:text-5xl lg:text-6xl">Pricing Calculator</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-[#606060] sm:text-lg">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. Calculate your estimated delivery charge before booking.
        </p>
      </div>

      <div className="my-10 border-b border-base-300 lg:my-14" />

      <h2 className="text-center text-3xl font-bold text-[#03373D] sm:text-4xl">Calculate Your Cost</h2>

      <div className="mx-auto mt-10 grid max-w-5xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <form onSubmit={handleCalculate} className="space-y-5" noValidate>
          <label className="form-control block">
            <span className="mb-2 block font-semibold text-slate-800">Parcel type</span>
            <select
              name="parcelType"
              value={form.parcelType}
              onChange={handleChange}
              className="select h-14 w-full rounded-xl border-slate-300 bg-white text-base focus:border-[#a8ce36] focus:outline-none"
            >
              <option value="" disabled>Select parcel type</option>
              <option value="document">Document</option>
              <option value="non-document">Non-document</option>
            </select>
          </label>

          <label className="form-control block">
            <span className="mb-2 block font-semibold text-slate-800">Delivery destination</span>
            <select
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className="select h-14 w-full rounded-xl border-slate-300 bg-white text-base focus:border-[#a8ce36] focus:outline-none"
            >
              <option value="" disabled>Select delivery destination</option>
              <option value="same-district">Within the same district</option>
              <option value="outside-district">Outside the district</option>
            </select>
          </label>

          <label className="form-control block">
            <span className="mb-2 block font-semibold text-slate-800">Weight (KG)</span>
            <input
              type="number"
              name="weight"
              min="0.1"
              step="0.1"
              inputMode="decimal"
              value={form.weight}
              onChange={handleChange}
              disabled={form.parcelType === 'document'}
              placeholder={form.parcelType === 'document' ? 'Not required for documents' : 'Enter parcel weight'}
              className="input h-14 w-full rounded-xl border-slate-300 bg-white text-base focus:border-[#a8ce36] focus:outline-none disabled:bg-base-200"
            />
          </label>

          {error && <p className="text-sm font-medium text-error" role="alert">{error}</p>}

          <div className="grid gap-3 pt-2 sm:grid-cols-[auto_1fr] sm:gap-4">
            <button type="button" onClick={handleReset} className="btn h-14 w-full rounded-xl border-[#91ad3e] bg-white px-7 text-[#6f8728] hover:bg-[#f4f9e5]">
              Reset
            </button>
            <button type="submit" className="btn h-14 rounded-xl border-[#c5ed58] bg-[#c5ed58] text-base text-black hover:border-[#b4dd45] hover:bg-[#b4dd45]">
              Calculate
            </button>
          </div>
        </form>

        <div className="flex min-h-56 items-center justify-center rounded-3xl bg-[#f5f8ed] p-5 text-center sm:p-8 lg:min-h-80">
          <div aria-live="polite">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#71852f]">Estimated delivery cost</p>
            <p className="mt-4 text-5xl font-black text-black min-[380px]:text-6xl sm:text-7xl">
              {cost === null ? '—' : `₹${cost.toFixed(2)}`}
            </p>
            <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[#606060]">
              {cost === null ? 'Complete the form to see your estimated charge.' : 'This estimate uses the same rates as parcel booking.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Bargainnig
