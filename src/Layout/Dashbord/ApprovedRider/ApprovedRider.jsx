import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FaCheck, FaIdCard, FaMapMarkerAlt, FaMotorcycle, FaPhone, FaRegEnvelope, FaTimes } from 'react-icons/fa'
import Swal from 'sweetalert2'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'
import DashboardLoader from '../../../Components/LoadingIndicator/DashboardLoader'

const ApprovedRider = () => {
  const axiosSecure = UseaxiosSecure()
  const queryClient = useQueryClient()
  const { data: riders = [], isLoading, isError, error } = useQuery({
    queryKey: ['pending-riders-review'],
    queryFn: async () => {
      const response = await axiosSecure.get('/riders?status=pending')
      return response.data
    },
  })

  const reviewRider = async (rider, status) => {
    const action = status === 'approved' ? 'approve' : 'reject'
    const confirmation = await Swal.fire({
      icon: status === 'approved' ? 'question' : 'warning',
      title: `${action === 'approve' ? 'Approve' : 'Reject'} this rider?`,
      text: `${rider.name}'s application will be marked as ${status}.`,
      showCancelButton: true,
      confirmButtonText: action === 'approve' ? 'Approve' : 'Reject',
      confirmButtonColor: status === 'approved' ? '#03373D' : '#DC2626',
    })

    if (!confirmation.isConfirmed) return

    try {
      const response = await axiosSecure.patch(`/riders/${rider._id}/status`, { status })
      await queryClient.invalidateQueries({ queryKey: ['pending-riders-review'] })
      await queryClient.invalidateQueries({ queryKey: ['unapproved-riders'] })
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 1800,
      })
    } catch (requestError) {
      Swal.fire({
        icon: 'error',
        title: 'Review failed',
        text: requestError.response?.data?.message || 'Unable to update this rider application.',
      })
    }
  }

  if (isLoading) {
    return <DashboardLoader message="Loading rider applications..." />
  }

  return (
    <section className="min-w-0 p-3 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-[#03373D] sm:text-3xl">Rider Approve</h2>
        <p className="mt-2 text-base-content/60">Review pending Be a Rider applications.</p>

        {isError && (
          <div className="alert alert-error mt-6 break-words">
            {error.response?.data?.message || 'Unable to load rider applications.'}
          </div>
        )}

        {!isError && riders.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-base-300 bg-base-100 p-6 text-center sm:p-10">
            <p className="text-lg font-semibold">No riders waiting for review</p>
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {riders.map((rider) => (
            <article key={rider._id} className="min-w-0 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#03373D]">{rider.name}</h3>
                  <p className="mt-1 text-xs text-base-content/50">Applied {new Date(rider.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="badge badge-warning capitalize">{rider.status || 'pending'}</span>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <p className="flex items-center gap-2 break-all"><FaRegEnvelope className="shrink-0" /> {rider.email}</p>
                <p className="flex items-center gap-2"><FaPhone className="shrink-0" /> {rider.phone}</p>
                <p className="flex items-center gap-2"><FaIdCard className="shrink-0" /> {rider.drivingLicense}</p>
                <p className="flex items-center gap-2"><FaMotorcycle className="shrink-0" /> {rider.bikeModel}</p>
                <p><span className="font-semibold">Bike registration:</span> {rider.bikeRegistration}</p>
                <p className="flex items-center gap-2"><FaMapMarkerAlt className="shrink-0" /> {rider.district}, {rider.region}</p>
                {rider.about && <p className="rounded-xl bg-base-200 p-3 text-base-content/70">{rider.about}</p>}
              </div>

              <div className="mt-5 grid gap-3 min-[360px]:grid-cols-2">
                <button type="button" onClick={() => reviewRider(rider, 'approved')} className="btn min-h-11 border-green-600 bg-green-600 text-white hover:border-green-700 hover:bg-green-700">
                  <FaCheck /> Approve
                </button>
                <button type="button" onClick={() => reviewRider(rider, 'rejected')} className="btn btn-outline min-h-11 border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                  <FaTimes /> Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ApprovedRider
