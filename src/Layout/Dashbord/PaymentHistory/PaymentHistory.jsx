import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaCheck, FaCopy, FaCreditCard, FaReceipt, FaSearch } from 'react-icons/fa'
import { Link, Navigate } from 'react-router'
import useAuth from '../../../Hooks/useAuth/useAuth'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'
import useUserRole from '../../../Hooks/useUserRole/useUserRole'
import DashboardLoader from '../../../Components/LoadingIndicator/DashboardLoader'

const formatAmount = (payment) => {
  const amount = Number.isFinite(payment.paymentAmount)
    ? payment.paymentAmount / 100
    : Number(payment.cost || 0)
  const currency = (payment.paymentCurrency || 'INR').toUpperCase()

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return 'Date unavailable'

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

const PaymentHistory = () => {
  const { user } = useAuth()
  const axiosSecure = UseaxiosSecure()
  const { isAdmin, isRoleLoading } = useUserRole()
  const [copiedTrackingId, setCopiedTrackingId] = useState('')

  const copyTrackingId = async (trackingId) => {
    await navigator.clipboard.writeText(trackingId)
    setCopiedTrackingId(trackingId)
    window.setTimeout(() => setCopiedTrackingId(''), 1800)
  }

  const {
    data: payments = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['payment-history', user?.email],
    enabled: Boolean(user?.email) && !isRoleLoading && !isAdmin,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${encodeURIComponent(user.email)}`)
      return res.data
    },
  })

  if (isRoleLoading) {
    return <DashboardLoader message="Loading your payment history..." />
  }

  if (isAdmin) return <Navigate to="/dashbord/admin-payment-history" replace />

  return (
    <main className="min-h-[calc(100vh-4rem)] min-w-0 bg-base-200/50 p-3 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex min-w-0 items-start gap-3 sm:mb-8 sm:items-center sm:gap-4">
          <div className="shrink-0 rounded-2xl bg-primary p-3 text-primary-content sm:p-4">
            <FaCreditCard className="text-xl sm:text-2xl" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Dashboard</p>
            <h1 className="text-2xl font-bold sm:text-4xl">Payment history</h1>
            <p className="mt-1 text-base-content/60">Review all your completed parcel payments.</p>
          </div>
        </div>

        {isLoading && (
          <DashboardLoader compact message="Loading your payment history..." />
        )}

        {isError && (
          <div className="alert alert-error flex-col items-start sm:flex-row sm:items-center">
            <span>We could not load your payment history.</span>
            <button className="btn btn-sm" onClick={() => refetch()}>Try again</button>
          </div>
        )}

        {!isLoading && !isError && payments.length === 0 && (
          <div className="rounded-3xl bg-base-100 px-5 py-12 text-center shadow-sm sm:px-6 sm:py-16">
            <FaReceipt className="mx-auto mb-4 text-5xl text-base-content/25" />
            <h2 className="text-2xl font-semibold">No payments yet</h2>
            <p className="mt-2 text-base-content/60">Completed parcel payments will appear here.</p>
          </div>
        )}

        {!isLoading && !isError && payments.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {payments.map((payment) => (
              <article
                key={payment._id}
                className="card min-w-0 overflow-hidden border border-base-300 bg-base-100 shadow-sm transition md:hover:-translate-y-1 md:hover:shadow-lg"
              >
                <div className="h-2 bg-primary" />
                <div className="card-body gap-5 p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Parcel payment</p>
                      <h2 className="mt-1 text-xl font-bold">{payment.parcelName || 'Unnamed parcel'}</h2>
                      <p className="mt-1 capitalize text-base-content/60">{payment.parceltype || 'Parcel delivery'}</p>
                    </div>
                    <span className="badge badge-success badge-outline shrink-0">Paid</span>
                  </div>

                  <div className="rounded-2xl bg-base-200 p-4">
                    <p className="text-xs uppercase tracking-wide text-base-content/50">Amount paid</p>
                    <p className="mt-1 break-words text-2xl font-bold text-primary sm:text-3xl">{formatAmount(payment)}</p>
                  </div>

                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="font-medium text-base-content/50">Parcel ID</dt>
                      <dd className="mt-1 break-all font-mono text-xs">{payment._id}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-base-content/50">Transaction ID</dt>
                      <dd className="mt-1 break-all font-mono text-xs">{payment.transactionId || 'Not available'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-base-content/50">Tracking ID</dt>
                      {payment.trackingId ? (
                        <dd className="mt-1 flex items-center gap-2 rounded-xl bg-base-200 p-2">
                          <span className="min-w-0 flex-1 break-all font-mono text-xs font-semibold text-primary">
                            {payment.trackingId}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyTrackingId(payment.trackingId)}
                            className="btn btn-square btn-ghost btn-sm shrink-0"
                            aria-label={`Copy tracking ID ${payment.trackingId}`}
                            title="Copy tracking ID"
                          >
                            {copiedTrackingId === payment.trackingId ? <FaCheck className="text-success" /> : <FaCopy />}
                          </button>
                        </dd>
                      ) : (
                        <dd className="mt-1 text-xs text-base-content/50">Not available</dd>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 border-t border-base-300 pt-3 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between min-[390px]:gap-4">
                      <dt className="font-medium text-base-content/50">Payment date</dt>
                      <dd className="font-medium min-[390px]:text-right">{formatDate(payment.paidAt)}</dd>
                    </div>
                  </dl>

                  {payment.trackingId && (
                    <Link
                      to={`/dashbord/track-parcel?trackingId=${encodeURIComponent(payment.trackingId)}`}
                      className="btn min-h-11 border-0 bg-[#CAEB66] font-bold text-[#03373D] shadow-none hover:bg-[#b9dc50]"
                    >
                      <FaSearch /> Track parcel
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default PaymentHistory
