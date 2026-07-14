import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useParams } from 'react-router'
import { FaRupeeSign } from 'react-icons/fa'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'
import DashboardLoader from '../../../Components/LoadingIndicator/DashboardLoader'

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
        return <DashboardLoader message="Loading parcel details..." />
    }

    if (isError || !parcel) {
        return (
            <div className="mx-3 my-4 max-w-3xl rounded-xl bg-white p-5 shadow-sm sm:mx-auto sm:my-6 sm:p-8">
                <h2 className="text-xl font-semibold text-red-600 sm:text-2xl">Parcel not found</h2>
                <Link to="/dashbord/my-parcels" className="btn btn-neutral mt-5 min-h-11 w-full sm:w-auto">
                    Back to my parcels
                </Link>
            </div>
        )
    }

    if (parcel.paymentStatus !== 'paid') {
        return (
            <div className="mx-3 my-4 max-w-3xl rounded-xl bg-white p-5 shadow-sm sm:mx-auto sm:my-6 sm:p-8">
                <h2 className="text-xl font-semibold text-amber-600 sm:text-2xl">Payment is still pending</h2>
                <p className="mt-2 text-gray-600">Complete the payment before tracking this parcel.</p>
                <Link to={`/dashbord/payment/${parcel._id}`} className="btn mt-5 min-h-11 w-full bg-amber-400 sm:w-auto">
                    Pay Now
                </Link>
            </div>
        )
    }

    const paymentId = parcel.transactionId || location.state?.paymentId
    const deliveryStatus = parcel.paymentStatus === 'paid' ? 'Parcel Shipped' : 'Pay Fast'

    return (
        <div className="mx-3 my-4 max-w-3xl rounded-xl bg-white p-4 shadow-sm sm:mx-auto sm:my-6 sm:p-8">
            <div className="flex flex-col items-start gap-3 min-[390px]:flex-row min-[390px]:justify-between min-[390px]:gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Pending parcel</p>
                    <h2 className="mt-1 break-words text-2xl font-semibold sm:text-3xl">{parcel.parcelName || 'Unnamed parcel'}</h2>
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

            <div className="mt-8 grid gap-3 min-[390px]:flex min-[390px]:flex-wrap">
                {parcel.trackingId && (
                    <Link to={`/dashbord/track-parcel?trackingId=${encodeURIComponent(parcel.trackingId)}`} className="btn min-h-11 border-0 bg-[#CAEB66] text-[#03373D]">
                        Track parcel
                    </Link>
                )}
                <Link to="/dashbord/my-parcels" className="btn btn-neutral min-h-11">
                    View all parcels
                </Link>
            </div>
        </div>
    )
}

export default PendingParcel
