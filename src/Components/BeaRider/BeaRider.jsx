import { use, useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import Swal from 'sweetalert2'
import agent from '../../assets/png/TeamsDwon/agent-pending.png'
import UseaxiosSecure from '../../Hooks/useAxios/useaxiosSecure'
import useAuth from '../../Hooks/useAuth/useAuth'

const regionsPromise = fetch('/Resoin.json').then((res) => res.json())

const BeaRider = () => {
  const locations = use(regionsPromise)
  const axiosSecure = UseaxiosSecure()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      region: '',
      district: '',
    },
  })

  const selectedRegion = useWatch({ control, name: 'region' })
  const regions = [...new Set(locations.map((location) => location.region))]
  const districts = locations
    .filter((location) => location.region === selectedRegion)
    .map((location) => location.district)
    .filter((district, index, values) => values.indexOf(district) === index)

  useEffect(() => {
    setValue('district', '')
  }, [selectedRegion, setValue])

  const handleRiderApplication = async (data) => {
    setIsSubmitting(true)

    try {
      const response = await axiosSecure.post('/riders', data)

      if (response.data.insertedId) {
        reset({
          name: user?.displayName || '',
          email: user?.email || '',
          drivingLicense: '',
          phone: '',
          region: '',
          district: '',
          aadhaarNumber: '',
          bikeModel: '',
          bikeRegistration: '',
          about: '',
        })
        Swal.fire({
          icon: 'success',
          title: 'Application submitted!',
          text: 'Your rider application has been saved successfully.',
          confirmButtonColor: '#03373D',
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission failed',
        text: error.response?.data?.message || 'Please try again in a moment.',
        confirmButtonColor: '#03373D',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldClass = (fieldName) => `input h-12 w-full bg-white ${errors[fieldName] ? 'border-red-500' : 'border-slate-300'}`
  const selectClass = (fieldName) => `select h-12 w-full bg-white ${errors[fieldName] ? 'border-red-500' : 'border-slate-300'}`

  return (
    <section className="mx-auto mb-12 mt-5 max-w-[1100px] rounded-2xl bg-white px-4 py-8 shadow-md sm:px-8 lg:mb-20 lg:p-12">
      <h1 className="text-3xl font-semibold text-[#03373D] sm:text-5xl">Be a Rider</h1>
      <p className="mt-3 max-w-3xl leading-7 text-[#606060]">
        Join our delivery team and help customers receive their parcels safely and on time.
      </p>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h2 className="text-2xl font-semibold text-[#03373D] sm:text-3xl">Tell us about yourself</h2>
          <form onSubmit={handleSubmit(handleRiderApplication)} className="mt-6 grid gap-5 sm:grid-cols-2" noValidate>
            <label className="form-control block">
              <span className="mb-2 block font-medium">Full Name *</span>
              <input {...register('name', { required: true })} type="text" className={fieldClass('name')} placeholder="Your full name" />
            </label>

            <label className="form-control block">
              <span className="mb-2 block font-medium">Email Address *</span>
              <input {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })} type="email" className={fieldClass('email')} placeholder="Your email address" />
            </label>

            <label className="form-control block">
              <span className="mb-2 block font-medium">Driving License Number *</span>
              <input {...register('drivingLicense', { required: true })} type="text" className={fieldClass('drivingLicense')} placeholder="License number" />
            </label>

            <label className="form-control block">
              <span className="mb-2 block font-medium">Phone Number *</span>
              <input {...register('phone', { required: true })} type="tel" className={fieldClass('phone')} placeholder="Phone number" />
            </label>

            <label className="form-control block">
              <span className="mb-2 block font-medium">Region *</span>
              <select {...register('region', { required: true })} className={selectClass('region')}>
                <option value="" disabled>Select your region</option>
                {regions.map((region) => <option key={region} value={region}>{region}</option>)}
              </select>
            </label>

            <label className="form-control block">
              <span className="mb-2 block font-medium">District *</span>
              <select {...register('district', { required: true })} disabled={!selectedRegion} className={`${selectClass('district')} disabled:bg-base-200`}>
                <option value="" disabled>{selectedRegion ? 'Select your district' : 'Select a region first'}</option>
                {districts.map((district) => <option key={district} value={district}>{district}</option>)}
              </select>
            </label>

            <label className="form-control block">
              <span className="mb-2 block font-medium">Aadhaar Number *</span>
              <input {...register('aadhaarNumber', { required: true, pattern: /^\d{12}$/ })} type="text" inputMode="numeric" maxLength="12" className={fieldClass('aadhaarNumber')} placeholder="12-digit Aadhaar number" />
            </label>

            <label className="form-control block">
              <span className="mb-2 block font-medium">Bike Model and Year *</span>
              <input {...register('bikeModel', { required: true })} type="text" className={fieldClass('bikeModel')} placeholder="Example: Hero Splendor 2024" />
            </label>

            <label className="form-control block sm:col-span-2">
              <span className="mb-2 block font-medium">Bike Registration Number *</span>
              <input {...register('bikeRegistration', { required: true })} type="text" className={fieldClass('bikeRegistration')} placeholder="Bike registration number" />
            </label>

            <label className="form-control block sm:col-span-2">
              <span className="mb-2 block font-medium">Tell Us About Yourself</span>
              <textarea {...register('about')} className="textarea min-h-28 w-full border-slate-300 bg-white" placeholder="Share your delivery experience or anything we should know" />
            </label>

            {Object.keys(errors).length > 0 && (
              <p className="text-sm font-semibold text-red-600 sm:col-span-2" role="alert">
                Please complete every required field with valid information.
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="btn h-13 border-[#CAEB66] bg-[#CAEB66] text-base text-black hover:border-[#b7dc4d] hover:bg-[#b7dc4d] sm:col-span-2">
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Submit Application'}
            </button>
          </form>
        </div>

        <div className="hidden lg:sticky lg:top-8 lg:block">
          <img src={agent} alt="Delivery rider application" className="mx-auto w-full max-w-sm" />
        </div>
      </div>
    </section>
  )
}

export default BeaRider
