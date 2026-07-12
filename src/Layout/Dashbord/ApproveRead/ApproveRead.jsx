import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FaCheck, FaMotorcycle, FaPhone, FaRegEnvelope } from 'react-icons/fa'
import Swal from 'sweetalert2'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'

const ApproveRead = () => {
  const axiosSecure = UseaxiosSecure()
  const queryClient = useQueryClient()
  const { data: riders = [], isLoading, isError, error } = useQuery({
    queryKey: ['unapproved-riders'],
    queryFn: async () => {
      const response = await axiosSecure.get('/riders?status=pending')
      return response.data
    },
  })

  const approveRider = async (rider) => {
    const confirmation = await Swal.fire({
      icon: 'question',
      title: 'Approve this rider?',
      text: `${rider.name} will be marked as an approved rider.`,
      showCancelButton: true,
      confirmButtonText: 'Approve',
      confirmButtonColor: '#03373D',
    })

    if (!confirmation.isConfirmed) return

    try {
      await axiosSecure.patch(`/riders/${rider._id}/status`, { status: 'approved' })
      await queryClient.invalidateQueries({ queryKey: ['unapproved-riders'] })
      Swal.fire({ icon: 'success', title: 'Rider approved', timer: 1600, showConfirmButton: false })
    } catch (requestError) {
      Swal.fire({
        icon: 'error',
        title: 'Approval failed',
        text: requestError.response?.data?.message || 'Unable to approve this rider.',
      })
    }
  }

  if (isLoading) {
    return <div className="flex min-h-72 items-center justify-center"><span className="loading loading-spinner loading-lg" /></div>
  }

  return (
    <section className="p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-[#03373D]">Approve Read</h1>
        <p className="mt-2 text-base-content/60">Review and approve pending rider applications.</p>

        {isError && <div className="alert alert-error mt-6">{error.response?.data?.message || 'Unable to load rider applications.'}</div>}

        {!isError && riders.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-base-300 bg-base-100 p-10 text-center">
            <p className="text-lg font-semibold">No riders waiting for approval</p>
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {riders.map((rider) => (
            <article key={rider._id} className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#03373D]">{rider.name}</h2>
              <p className="mt-1 text-sm capitalize text-amber-600">{rider.status}</p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2"><FaRegEnvelope /> {rider.email}</p>
                <p className="flex items-center gap-2"><FaPhone /> {rider.phone}</p>
                <p className="flex items-center gap-2"><FaMotorcycle /> {rider.bikeModel}</p>
                <p><span className="font-semibold">Registration:</span> {rider.bikeRegistration}</p>
                <p><span className="font-semibold">Area:</span> {rider.district}, {rider.region}</p>
              </div>
              <button type="button" onClick={() => approveRider(rider)} className="btn mt-5 w-full border-[#CAEB66] bg-[#CAEB66] text-[#03373D] hover:border-[#b7dc4d] hover:bg-[#b7dc4d]">
                <FaCheck /> Approve rider
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ApproveRead
