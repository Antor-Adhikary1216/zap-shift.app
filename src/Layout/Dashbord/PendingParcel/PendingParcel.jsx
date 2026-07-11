import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useParams } from 'react-router'
import { FaRupeeSign } from 'react-icons/fa'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'

const PendingParcel = () => {
    const { parcelId } = useParams()
    const location = useLocation()
    const axiosSecure = UseaxiosSecure()

    const {
        data: parcel,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['parcel', parcelId],
        enabled: Boolean(parcelId),
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`)
            return res.data
        },
    })

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <span className="loading loading-spinner loading-lg" aria-label="Loading pending parcel"></span>
            </div>
        )
    }

    if (isError || !parcel) {
        return (
            <div className="m-6 rounded-xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-red-600">Parcel not found</h2>
                <Link to="/dashbord/my-parcels" className="btn btn-neutral mt-5">
                    Back to my parcels
                </Link>
            </div>
        )
    }

    if (parcel.paymentStatus !== 'paid') {
        return (
            <div className="m-6 rounded-xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-amber-600">Payment is still pending</h2>
                <p className="mt-2 text-gray-600">Complete the payment before tracking this parcel.</p>
                <Link to={`/dashbord/payment/${parcel._id}`} className="btn bg-amber-400 mt-5">
                    Pay Now
                </Link>
            </div>
        )
    }

    const paymentId = parcel.transactionId || location.state?.paymentId
    const deliveryStatus = parcel.paymentStatus === 'paid' ? 'Parcel Shipped' : 'Pay Fast'

    return (
        <div className="m-4 max-w-3xl rounded-xl bg-white p-5 shadow-sm sm:m-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Pending parcel</p>
                    <h2 className="mt-1 text-3xl font-semibold">{parcel.parcelName || 'Unnamed parcel'}</h2>
                </div>
                <span className="badge badge-warning badge-lg">{deliveryStatus}</span>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-gray-500">Parcel ID</p>
                    <p className="break-all font-medium">{parcel._id}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Payment ID</p>
                    <p className="break-all font-medium text-green-600">{paymentId || 'Processing'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Payment status</p>
                    <p className="font-medium text-green-600">Paid</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Tracking ID</p>
                    <p className="break-all font-medium text-[#03373D]">{parcel.trackingId || 'Generating'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Amount paid</p>
                    <p className="flex items-center gap-1 font-medium">{parcel.cost} <FaRupeeSign /></p>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
                {parcel.trackingId && (
                    <Link to={`/track-parcel?trackingId=${encodeURIComponent(parcel.trackingId)}`} className="btn bg-[#CAEB66] text-[#03373D] border-0">
                        Track parcel
                    </Link>
                )}
                <Link to="/dashbord/my-parcels" className="btn btn-neutral">
                    View all parcels
                </Link>
            </div>
        </div>
    )
}

export default PendingParcel
