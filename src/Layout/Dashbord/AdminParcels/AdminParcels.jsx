import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaBoxOpen, FaBoxes, FaEye, FaMapMarkerAlt, FaTimes } from 'react-icons/fa'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'
import DashboardLoader from '../../../Components/LoadingIndicator/DashboardLoader'

const formatDate = (date) => date
  ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
  : 'Not available'

const displayType = (type) => type === 'document' ? 'Document' : type === 'none-documet' ? 'Non-document' : type || 'Not available'

const StatusBadge = ({ paid }) => (
  <span className={`badge whitespace-nowrap font-semibold ${paid ? 'badge-success badge-outline' : 'badge-warning badge-outline'}`}>
    {paid ? 'Paid' : 'Payment pending'}
  </span>
)

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">{label}</p>
    <p className="mt-1 break-words font-medium text-[#03373D]">{value || 'Not available'}</p>
  </div>
)

const AdminParcels = () => {
  const axiosSecure = UseaxiosSecure()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedParcel, setSelectedParcel] = useState(null)
  const { data: parcels = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-parcels'],
    queryFn: async () => {
      const response = await axiosSecure.get('/admin/parcels')
      return response.data
    },
  })

  const parcelsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(parcels.length / parcelsPerPage))
  const activePage = Math.min(currentPage, totalPages)
  const firstParcelIndex = (activePage - 1) * parcelsPerPage
  const visibleParcels = parcels.slice(firstParcelIndex, firstParcelIndex + parcelsPerPage)
  const pendingCount = parcels.filter((parcel) => parcel.paymentStatus !== 'paid').length

  if (isLoading) {
    return <DashboardLoader message="Loading all parcels..." />
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] min-w-0 bg-base-200/50 p-3 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <div className="shrink-0 rounded-2xl bg-[#03373D] p-3 text-[#CAEB66] sm:p-4"><FaBoxes className="text-xl sm:text-2xl" /></div>
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Admin dashboard</p>
              <h1 className="text-2xl font-bold text-[#03373D] sm:text-4xl">All parcels</h1>
              <p className="mt-1 text-base-content/60">Review parcel and customer details from every user.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="rounded-2xl bg-base-100 px-4 py-3 text-left shadow-sm sm:px-5 sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">Total parcels</p>
              <p className="text-2xl font-bold text-[#03373D]">{parcels.length}</p>
            </div>
            <div className="rounded-2xl bg-[#FFF7D6] px-4 py-3 text-left sm:px-5 sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#876B00]">Pending</p>
              <p className="text-2xl font-bold text-[#03373D]">{pendingCount}</p>
            </div>
          </div>
        </div>

        {isError && (
          <div className="alert alert-error mt-7 flex-col items-start sm:flex-row sm:items-center">
            <span>{error.response?.data?.message || 'Unable to load parcels.'}</span>
            <button className="btn btn-sm" onClick={() => refetch()}>Try again</button>
          </div>
        )}

        {!isError && parcels.length === 0 && (
          <div className="mt-8 rounded-3xl bg-base-100 px-5 py-12 text-center shadow-sm sm:px-6 sm:py-16">
            <FaBoxOpen className="mx-auto mb-4 text-5xl text-base-content/25" />
            <h2 className="text-2xl font-semibold">No parcels found</h2>
          </div>
        )}

        {!isError && parcels.length > 0 && (
          <div className="mt-6 space-y-4 md:hidden">
            {visibleParcels.map((parcel, index) => (
              <article key={parcel._id} className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">Parcel {firstParcelIndex + index + 1}</p>
                    <h2 className="mt-1 truncate text-lg font-bold text-[#03373D]">{parcel.parcelName || 'Unnamed parcel'}</h2>
                    <p className="text-sm text-base-content/60">{displayType(parcel.parceltype)}{parcel.parcelWeight ? ` · ${parcel.parcelWeight} kg` : ''}</p>
                  </div>
                  <StatusBadge paid={parcel.paymentStatus === 'paid'} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-base-200/70 p-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-xs text-base-content/50">Customer</p>
                    <p className="truncate font-semibold text-[#03373D]">{parcel.userName || 'Name unavailable'}</p>
                    <p className="break-all text-xs text-base-content/60">{parcel.senderemail || 'Email unavailable'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50">Cost</p>
                    <p className="font-bold text-[#617718]">₹{Number(parcel.cost || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-base-content/50">Route</p>
                    <p className="break-words font-medium">{parcel.receiverDestricts || 'Unknown'} → {parcel.senderDestricts || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50">Receiver</p>
                    <p className="break-words font-medium">{parcel.receiverName || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50">Delivery</p>
                    <p className="break-words font-medium">{parcel.deliveryStatus || (parcel.paymentStatus === 'paid' ? 'Parcel Shipped' : 'Awaiting payment')}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-base-content/50">{formatDate(parcel.createdAt)}</p>
                  <button className="btn min-h-11 border-0 bg-[#CAEB66] text-[#03373D]" onClick={() => setSelectedParcel(parcel)}><FaEye /> Details</button>
                </div>
              </article>
            ))}

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm">
              <button className="btn btn-sm min-h-11" disabled={activePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>Previous</button>
              <span className="text-sm font-semibold text-[#03373D]">{activePage} / {totalPages}</span>
              <button className="btn btn-sm min-h-11" disabled={activePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>Next</button>
            </div>
            <p className="text-center text-xs text-base-content/55">Showing {firstParcelIndex + 1}–{Math.min(firstParcelIndex + parcelsPerPage, parcels.length)} of {parcels.length} parcels</p>
          </div>
        )}

        {!isError && parcels.length > 0 && (
          <div className="mt-8 hidden max-w-full overflow-x-auto overscroll-x-contain rounded-2xl border border-base-300 bg-base-100 shadow-sm md:block">
            <table className="table min-w-max">
              <thead className="bg-base-200 text-sm text-[#03373D]">
                <tr>
                  <th>#</th><th>User</th><th>Parcel details</th><th>Receiver</th><th>Route</th><th>Payment</th><th>Delivery</th><th>Created</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleParcels.map((parcel, index) => (
                  <tr key={parcel._id} className="hover:bg-base-200/50">
                    <th>{firstParcelIndex + index + 1}</th>
                    <td className="max-w-56"><p className="font-semibold text-[#03373D]">{parcel.userName || 'Name not available'}</p><p className="break-all text-xs text-base-content/60">{parcel.senderemail || 'Email not available'}</p></td>
                    <td><p className="whitespace-nowrap font-semibold text-[#03373D]">{parcel.parcelName || 'Unnamed parcel'}</p><p className="text-xs text-base-content/60">{displayType(parcel.parceltype)}{parcel.parcelWeight ? ` · ${parcel.parcelWeight} kg` : ''}</p><p className="text-xs font-semibold text-[#617718]">₹{Number(parcel.cost || 0).toLocaleString('en-IN')}</p></td>
                    <td><p className="whitespace-nowrap font-medium">{parcel.receiverName || 'Not available'}</p><p className="text-xs text-base-content/60">{parcel['receiver Contect'] || 'No contact'}</p></td>
                    <td className="min-w-44 text-xs"><p>{parcel.receiverDestricts || 'Unknown'} → {parcel.senderDestricts || 'Unknown'}</p><p className="mt-1 text-base-content/50">{parcel.receiverrwatch || ''}{parcel.receiverrwatch && parcel.senderwatch ? ' to ' : ''}{parcel.senderwatch || ''}</p></td>
                    <td><StatusBadge paid={parcel.paymentStatus === 'paid'} /></td>
                    <td><span className="whitespace-nowrap">{parcel.deliveryStatus || (parcel.paymentStatus === 'paid' ? 'Parcel Shipped' : 'Awaiting payment')}</span></td>
                    <td className="whitespace-nowrap text-sm">{formatDate(parcel.createdAt)}</td>
                    <td><button className="btn btn-sm border-0 bg-[#CAEB66] text-[#03373D]" onClick={() => setSelectedParcel(parcel)}><FaEye /> Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-col gap-4 border-t border-base-300 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-base-content/60">Showing {firstParcelIndex + 1}–{Math.min(firstParcelIndex + parcelsPerPage, parcels.length)} of {parcels.length} parcels</p>
              <div className="join max-w-full overflow-x-auto pb-1">
                <button className="btn join-item btn-sm" disabled={activePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>Previous</button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button key={page} className={`btn join-item btn-sm ${page === activePage ? 'bg-[#CAEB66] text-[#03373D]' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>)}
                <button className="btn join-item btn-sm" disabled={activePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedParcel && (
        <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="parcel-details-title">
          <div className="modal-box mx-3 max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-4xl overflow-y-auto p-0">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[#03373D] px-4 py-4 text-white sm:px-6 sm:py-5">
              <div className="min-w-0"><p className="text-sm text-[#CAEB66]">Parcel details</p><h2 id="parcel-details-title" className="truncate text-xl font-bold sm:text-2xl">{selectedParcel.parcelName || 'Unnamed parcel'}</h2></div>
              <button className="btn btn-circle btn-ghost min-h-11 shrink-0 text-white" onClick={() => setSelectedParcel(null)} aria-label="Close parcel details"><FaTimes /></button>
            </div>
            <div className="space-y-6 p-4 sm:space-y-7 sm:p-6">
              <section>
                <h3 className="mb-4 font-bold text-[#03373D]">Parcel</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <DetailItem label="Type" value={displayType(selectedParcel.parceltype)} /><DetailItem label="Weight" value={selectedParcel.parcelWeight ? `${selectedParcel.parcelWeight} kg` : selectedParcel.parceltype === 'document' ? 'Not required' : null} /><DetailItem label="Cost" value={`₹${Number(selectedParcel.cost || 0).toLocaleString('en-IN')}`} /><DetailItem label="Created" value={formatDate(selectedParcel.createdAt)} /><DetailItem label="Payment" value={selectedParcel.paymentStatus === 'paid' ? 'Paid' : 'Payment pending'} /><DetailItem label="Delivery" value={selectedParcel.deliveryStatus || (selectedParcel.paymentStatus === 'paid' ? 'Parcel Shipped' : 'Awaiting payment')} /><DetailItem label="Tracking ID" value={selectedParcel.trackingId} /><DetailItem label="Transaction ID" value={selectedParcel.transactionId} />
                </div>
              </section>
              <section className="grid gap-6 border-t border-base-300 pt-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-base-200/70 p-4 sm:p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-[#03373D]"><FaMapMarkerAlt className="text-primary" /> Sender</h3>
                  <div className="grid gap-4 sm:grid-cols-2"><DetailItem label="Name" value={selectedParcel.userName} /><DetailItem label="Email" value={selectedParcel.senderemail} /><DetailItem label="Phone" value={selectedParcel[' senderNo']} /><DetailItem label="Location" value={[selectedParcel.receiverDestricts, selectedParcel.receiverrwatch].filter(Boolean).join(', ')} /><div className="sm:col-span-2"><DetailItem label="Pickup address" value={selectedParcel['senderpickup Address']} /></div><div className="sm:col-span-2"><DetailItem label="Pickup instruction" value={selectedParcel['sender instruction']} /></div></div>
                </div>
                <div className="rounded-2xl bg-[#F3F9DF] p-4 sm:p-5">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-[#03373D]"><FaMapMarkerAlt className="text-primary" /> Receiver</h3>
                  <div className="grid gap-4 sm:grid-cols-2"><DetailItem label="Name" value={selectedParcel.receiverName} /><DetailItem label="Email" value={selectedParcel['receiver email address']} /><DetailItem label="Phone" value={selectedParcel['receiver Contect']} /><DetailItem label="Location" value={[selectedParcel.senderDestricts, selectedParcel.senderwatch].filter(Boolean).join(', ')} /><div className="sm:col-span-2"><DetailItem label="Delivery address" value={selectedParcel['delibery Address']} /></div><div className="sm:col-span-2"><DetailItem label="Delivery instruction" value={selectedParcel['Delibery instruction']} /></div></div>
                </div>
              </section>
            </div>
          </div>
          <button className="modal-backdrop cursor-default" onClick={() => setSelectedParcel(null)} aria-label="Close parcel details" />
        </div>
      )}
    </main>
  )
}

export default AdminParcels
