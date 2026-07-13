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
    <main className="min-h-[calc(100vh-4rem)] bg-base-200/50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[#03373D] p-4 text-[#CAEB66]"><FaMoneyCheckAlt className="text-2xl" /></div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Admin dashboard</p>
              <h1 className="text-3xl font-bold text-[#03373D] sm:text-4xl">All payment history</h1>
              <p className="mt-1 text-base-content/60">Review completed parcel payments from every user.</p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#F3F9DF] px-5 py-3 text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#617718]">Total collected</p>
            <p className="text-2xl font-bold text-[#03373D]">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalCollected)}</p>
          </div>
        </div>

        {isError && (
          <div className="alert alert-error mt-7">
            <span>{error.response?.data?.message || 'Unable to load payment history.'}</span>
            <button className="btn btn-sm" onClick={() => refetch()}>Try again</button>
          </div>
        )}

        {!isError && payments.length === 0 && (
          <div className="mt-8 rounded-3xl bg-base-100 px-6 py-16 text-center shadow-sm">
            <FaReceipt className="mx-auto mb-4 text-5xl text-base-content/25" />
            <h2 className="text-2xl font-semibold">No completed payments</h2>
          </div>
        )}

        {!isError && payments.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <table className="table">
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
              <div className="join">
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
