import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaMoneyCheckAlt, FaReceipt } from 'react-icons/fa'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'
import DashboardLoader from '../../../Components/LoadingIndicator/DashboardLoader'

const formatAmount = (payment) => {
  const amount = Number.isFinite(payment.paymentAmount)
    ? payment.paymentAmount / 100
    : Number(payment.cost || 0)

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: (payment.paymentCurrency || 'INR').toUpperCase(),
  }).format(amount)
}

const formatDate = (date) => date
  ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
  : 'Not available'

const AdminPaymentHistory = () => {
  const axiosSecure = UseaxiosSecure()
  const [currentPage, setCurrentPage] = useState(1)
  const { data: payments = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-payment-history'],
    queryFn: async () => {
      const response = await axiosSecure.get('/admin/payments')
      return response.data
    },
  })

  const paymentsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(payments.length / paymentsPerPage))
  const activePage = Math.min(currentPage, totalPages)
  const firstPaymentIndex = (activePage - 1) * paymentsPerPage
  const visiblePayments = payments.slice(firstPaymentIndex, firstPaymentIndex + paymentsPerPage)
  const totalCollected = payments.reduce((sum, payment) => {
    const amount = Number.isFinite(payment.paymentAmount) ? payment.paymentAmount / 100 : Number(payment.cost || 0)
    return sum + amount
  }, 0)

  if (isLoading) {
    return <DashboardLoader message="Loading all payments..." />
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] min-w-0 bg-base-200/50 p-3 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <div className="shrink-0 rounded-2xl bg-[#03373D] p-3 text-[#CAEB66] sm:p-4"><FaMoneyCheckAlt className="text-xl sm:text-2xl" /></div>
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Admin dashboard</p>
              <h1 className="text-2xl font-bold text-[#03373D] sm:text-4xl">All payment history</h1>
              <p className="mt-1 text-base-content/60">Review completed parcel payments from every user.</p>
            </div>
          </div>
          <div className="w-full rounded-2xl bg-[#F3F9DF] px-4 py-3 text-left sm:w-auto sm:px-5 sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#617718]">Total collected</p>
            <p className="break-words text-xl font-bold text-[#03373D] sm:text-2xl">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalCollected)}</p>
          </div>
        </div>

        {isError && (
          <div className="alert alert-error mt-7 flex-col items-start sm:flex-row sm:items-center">
            <span>{error.response?.data?.message || 'Unable to load payment history.'}</span>
            <button className="btn btn-sm" onClick={() => refetch()}>Try again</button>
          </div>
        )}

        {!isError && payments.length === 0 && (
          <div className="mt-8 rounded-3xl bg-base-100 px-5 py-12 text-center shadow-sm sm:px-6 sm:py-16">
            <FaReceipt className="mx-auto mb-4 text-5xl text-base-content/25" />
            <h2 className="text-2xl font-semibold">No completed payments</h2>
          </div>
        )}

        {!isError && payments.length > 0 && (
          <div className="mt-6 space-y-4 md:hidden">
            {visiblePayments.map((payment, index) => (
              <article key={payment._id} className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">Payment {firstPaymentIndex + index + 1}</p>
                    <h2 className="mt-1 truncate text-lg font-bold text-[#03373D]">{payment.parcelName || 'Unnamed parcel'}</h2>
                    <p className="break-all text-sm text-base-content/60">{payment.senderemail || 'Email not available'}</p>
                  </div>
                  <span className={`badge shrink-0 whitespace-nowrap font-semibold ${payment.paymentStatus === 'paid' ? 'badge-success badge-outline' : 'badge-warning badge-outline'}`}>
                    {payment.paymentStatus === 'paid' ? 'Paid' : payment.paymentStatus || 'Pending'}
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-[#F3F9DF] p-3">
                  <p className="text-xs uppercase tracking-wide text-[#617718]">Amount paid</p>
                  <p className="mt-1 text-2xl font-bold text-[#03373D]">{formatAmount(payment)}</p>
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-base-content/50">Customer</dt>
                    <dd className="break-words font-semibold text-[#03373D]">{payment.userName || 'Name not available'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-base-content/50">Transaction ID</dt>
                    <dd className="break-all font-mono text-xs">{payment.transactionId || 'Not available'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-base-content/50">Tracking ID</dt>
                    <dd className="break-all font-mono text-xs">{payment.trackingId || 'Not available'}</dd>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-base-300 pt-3 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
                    <dt className="text-xs text-base-content/50">Paid at</dt>
                    <dd className="font-medium">{formatDate(payment.paidAt)}</dd>
                  </div>
                </dl>
              </article>
            ))}

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm">
              <button className="btn btn-sm min-h-11" disabled={activePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>Previous</button>
              <span className="text-sm font-semibold text-[#03373D]">{activePage} / {totalPages}</span>
              <button className="btn btn-sm min-h-11" disabled={activePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>Next</button>
            </div>
            <p className="text-center text-xs text-base-content/55">Showing {firstPaymentIndex + 1}–{Math.min(firstPaymentIndex + paymentsPerPage, payments.length)} of {payments.length} payments</p>
          </div>
        )}

        {!isError && payments.length > 0 && (
          <div className="mt-8 hidden max-w-full overflow-x-auto overscroll-x-contain rounded-2xl border border-base-300 bg-base-100 shadow-sm md:block">
            <table className="table min-w-max">
              <thead className="bg-base-200 text-sm text-[#03373D]">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Parcel</th>
                  <th>Amount</th>
                  <th>Payment status</th>
                  <th>Transaction ID</th>
                  <th>Tracking ID</th>
                  <th>Paid at</th>
                </tr>
              </thead>
              <tbody>
                {visiblePayments.map((payment, index) => (
                  <tr key={payment._id} className="hover:bg-base-200/50">
                    <th>{firstPaymentIndex + index + 1}</th>
                    <td className="max-w-56">
                      <p className="font-semibold text-[#03373D]">{payment.userName || 'Name not available'}</p>
                      <p className="break-all text-xs text-base-content/60">{payment.senderemail || 'Email not available'}</p>
                    </td>
                    <td>
                      <p className="whitespace-nowrap font-semibold text-[#03373D]">{payment.parcelName || 'Unnamed parcel'}</p>
                      <p className="text-xs capitalize text-base-content/50">{payment.parceltype || 'Parcel delivery'}</p>
                    </td>
                    <td className="whitespace-nowrap font-bold text-[#617718]">{formatAmount(payment)}</td>
                    <td>
                      <span className={`badge whitespace-nowrap font-semibold ${payment.paymentStatus === 'paid' ? 'badge-success badge-outline' : 'badge-warning badge-outline'}`}>
                        {payment.paymentStatus === 'paid' ? 'Paid' : payment.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="max-w-52 break-all font-mono text-xs">{payment.transactionId || 'Not available'}</td>
                    <td className="max-w-44 break-all font-mono text-xs">{payment.trackingId || 'Not available'}</td>
                    <td className="whitespace-nowrap">{formatDate(payment.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col gap-4 border-t border-base-300 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-base-content/60">
                Showing {firstPaymentIndex + 1}–{Math.min(firstPaymentIndex + paymentsPerPage, payments.length)} of {payments.length} payments
              </p>
              <div className="join max-w-full overflow-x-auto pb-1">
                <button className="btn join-item btn-sm" disabled={activePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>Previous</button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button key={page} className={`btn join-item btn-sm ${page === activePage ? 'bg-[#CAEB66] text-[#03373D]' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
                ))}
                <button className="btn join-item btn-sm" disabled={activePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default AdminPaymentHistory
