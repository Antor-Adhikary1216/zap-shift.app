import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaHeadset,
  FaMapMarkerAlt,
  FaRegCommentDots,
  FaTicketAlt,
} from 'react-icons/fa'
import Swal from 'sweetalert2'
import DashboardLoader from '../../../Components/LoadingIndicator/DashboardLoader'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'

const formatDate = (date) => date
  ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
  : 'Date not available'

const topicLabels = {
  booking: 'Book or send a parcel',
  parcel: 'Parcel delivery',
  pickup: 'Pickup issue',
  tracking: 'Track a parcel',
  'delivery-delay': 'Delivery delay',
  'failed-delivery': 'Failed or missed delivery',
  'change-cancel': 'Change details or cancel a booking',
  'damaged-parcel': 'Damaged parcel',
  'lost-parcel': 'Lost or missing parcel',
  payment: 'Payment problem',
  refund: 'Refund request',
  invoice: 'Invoice or payment receipt',
  account: 'Account or login problem',
  verification: 'Email verification',
  technical: 'Website or technical issue',
  pricing: 'Pricing question',
  coverage: 'Delivery coverage',
  rider: 'Rider application',
  business: 'Business or bulk delivery',
  safety: 'Safety or security concern',
  complaint: 'Complaint about service',
  other: 'Other',
}

const statusStyles = {
  new: 'border-blue-200 bg-blue-50 text-blue-700',
  'in-progress': 'border-amber-200 bg-amber-50 text-amber-700',
  resolved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const AdminCustomerHelp = () => {
  const axiosSecure = UseaxiosSecure()
  const [activeRequest, setActiveRequest] = useState('')
  const { data: requests = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-support-requests'],
    queryFn: async () => {
      const response = await axiosSecure.get('/admin/support-requests')
      return response.data
    },
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const newCount = requests.filter((request) => request.status === 'new').length
  const resolvedCount = requests.filter((request) => request.status === 'resolved').length

  const updateStatus = async (request, status) => {
    if (status === request.status) return

    setActiveRequest(request._id)
    try {
      const response = await axiosSecure.patch(`/admin/support-requests/${request._id}/status`, { status })
      await refetch()
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 2200,
      })
    } catch (actionError) {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: actionError.response?.data?.message || 'Unable to update this support request.',
      })
    } finally {
      setActiveRequest('')
    }
  }

  if (isLoading) {
    return <DashboardLoader message="Loading customer help requests..." />
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] min-w-0 bg-base-200/50 p-3 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <div className="shrink-0 rounded-2xl bg-[#03373D] p-3 text-[#CAEB66] sm:p-4">
              <FaHeadset className="text-xl sm:text-2xl" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#617718]">Admin dashboard</p>
              <h1 className="text-2xl font-bold text-[#03373D] sm:text-4xl">Customer help</h1>
              <p className="mt-1 text-base-content/60">Review and manage requests submitted through Contact Us.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-2xl border border-[#DDE9BB] bg-[#F3F9DF] px-3 py-3 text-center sm:px-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#617718] sm:text-xs">Total</p>
              <p className="mt-1 text-xl font-bold text-[#03373D] sm:text-2xl">{requests.length}</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-3 py-3 text-center sm:px-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 sm:text-xs">New</p>
              <p className="mt-1 text-xl font-bold text-[#03373D] sm:text-2xl">{newCount}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-center sm:px-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 sm:text-xs">Resolved</p>
              <p className="mt-1 text-xl font-bold text-[#03373D] sm:text-2xl">{resolvedCount}</p>
            </div>
          </div>
        </div>

        {isError && (
          <div className="alert alert-error mt-7 flex-col items-start sm:flex-row sm:items-center">
            <span>{error.response?.data?.message || 'Unable to load customer help requests.'}</span>
            <button type="button" className="btn btn-sm" onClick={() => refetch()}>Try again</button>
          </div>
        )}

        {!isError && requests.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-base-300 bg-base-100 px-5 py-14 text-center shadow-sm sm:px-8 sm:py-20">
            <FaHeadset className="mx-auto text-5xl text-base-content/20" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold text-[#03373D]">No help requests yet</h2>
            <p className="mt-2 text-base-content/60">New Contact Us tickets will appear here automatically.</p>
          </div>
        )}

        {!isError && requests.length > 0 && (
          <ol className="mt-8 space-y-5" aria-label="Customer help requests, newest first">
            {requests.map((request, index) => (
              <li key={request._id}>
                <article className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                  <div className="border-b border-base-200 bg-[#F8FAF5] px-4 py-4 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#03373D] text-sm font-bold text-[#CAEB66]">{index + 1}</span>
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-base-content/45"><FaTicketAlt aria-hidden="true" /> Ticket ID</p>
                          <h2 className="mt-1 break-all font-mono text-sm font-bold text-[#03373D] sm:text-base">{request.ticketId}</h2>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center">
                        <span className={`w-fit rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[request.status] || statusStyles.new}`}>
                          {(request.status || 'new').replace('-', ' ')}
                        </span>
                        <select
                          value={request.status || 'new'}
                          onChange={(event) => updateStatus(request, event.target.value)}
                          disabled={activeRequest === request._id}
                          aria-label={`Update status for ticket ${request.ticketId}`}
                          className="select select-bordered select-sm min-h-10 w-full bg-white font-semibold text-[#03373D] min-[420px]:w-auto"
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[0.72fr_1.28fr]">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">Customer</p>
                        <p className="mt-1 break-words font-bold text-[#03373D]">{request.name}</p>
                        <a href={`mailto:${request.email}`} className="mt-1 flex min-w-0 items-center gap-2 break-all text-sm text-[#617718] hover:underline">
                          <FaEnvelope className="shrink-0" aria-hidden="true" /> {request.email}
                        </a>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">Help topic</p>
                        <p className="mt-1 font-semibold text-[#03373D]">{topicLabels[request.category] || 'Other'}</p>
                      </div>

                      {request.trackingId && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">Tracking ID</p>
                          <p className="mt-1 flex items-start gap-2 break-all font-mono text-sm text-[#03373D]"><FaMapMarkerAlt className="mt-0.5 shrink-0 text-[#789529]" aria-hidden="true" /> {request.trackingId}</p>
                        </div>
                      )}

                      <p className="flex items-center gap-2 text-xs text-base-content/50"><FaClock aria-hidden="true" /> {formatDate(request.createdAt)}</p>
                    </div>

                    <div className="relative rounded-2xl bg-[#F7F9F2] px-4 py-5 sm:px-6 sm:py-6">
                      <FaRegCommentDots className="text-2xl text-[#A8CE36]" aria-hidden="true" />
                      <p className="mt-4 whitespace-pre-wrap break-words leading-7 text-[#405255]">{request.message}</p>
                      {request.status === 'resolved' && (
                        <p className="mt-5 flex items-center gap-2 border-t border-emerald-200 pt-4 text-sm font-semibold text-emerald-700">
                          <FaCheckCircle aria-hidden="true" /> Resolved {request.resolvedAt ? formatDate(request.resolvedAt) : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  )
}

export default AdminCustomerHelp
