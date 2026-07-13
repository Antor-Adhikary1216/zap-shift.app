import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router'
import UseaxiosSecure from '../../../../Hooks/useAxios/useaxiosSecure'
import DashboardLoader from '../../../../Components/LoadingIndicator/DashboardLoader'

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const axiosSecure = UseaxiosSecure()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [redirectSeconds, setRedirectSeconds] = useState(5)

    const {
        data: confirmation,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['payment-confirmation', sessionId],
        enabled: Boolean(sessionId),
        retry: false,
        queryFn: async () => {
            const res = await axiosSecure.post('/confirm-payment', { sessionId })
            return res.data
        },
    })

    useEffect(() => {
        if (confirmation?.paymentStatus !== 'paid' || !confirmation.parcelId) {
            return undefined
        }

        queryClient.invalidateQueries({ queryKey: ['my-parcels'] })
        queryClient.invalidateQueries({ queryKey: ['parcel', confirmation.parcelId] })

        const countdown = window.setInterval(() => {
            setRedirectSeconds(current => Math.max(current - 1, 0))
        }, 1000)

        const redirect = window.setTimeout(() => {
            navigate(`/dashbord/pending-parcel/${confirmation.parcelId}`, {
                replace: true,
                state: { paymentId: confirmation.transactionId },
            })
        }, 5000)

        return () => {
            window.clearInterval(countdown)
            window.clearTimeout(redirect)
        }
    }, [confirmation, navigate, queryClient])

    if (!sessionId) {
        return (
            <div className="m-4 max-w-xl rounded-xl bg-white p-5 text-center shadow-sm sm:m-6 sm:p-8">
                <h2 className="text-3xl font-semibold text-red-600">Payment confirmation unavailable</h2>
                <p className="mt-3 text-gray-600">The Stripe session ID is missing.</p>
                <Link to="/dashbord/my-parcels" className="btn btn-neutral mt-6">
                    Back to my parcels
                </Link>
            </div>
        )
    }

    if (isLoading) {
        return <DashboardLoader message="Confirming your payment..." />
    }

    if (isError) {
        return (
            <div className="m-4 max-w-xl rounded-xl bg-white p-5 text-center shadow-sm sm:m-6 sm:p-8">
                <h2 className="text-3xl font-semibold text-red-600">Payment could not be confirmed</h2>
                <p className="mt-3 text-gray-600">
                    {error.response?.data?.message || 'Please return to your parcels and try again.'}
                </p>
                <Link to="/dashbord/my-parcels" className="btn btn-neutral mt-6">
                    Back to my parcels
                </Link>
            </div>
        )
    }

    return (
        <div className="m-4 max-w-xl rounded-xl bg-white p-5 text-center shadow-sm sm:m-6 sm:p-8">
            <h2 className="text-3xl font-semibold text-green-600">Payment successful</h2>
            <p className="mt-3 text-gray-600">Your parcel is now marked as paid.</p>
            {confirmation?.transactionId && (
                <div className="mt-5 rounded-lg bg-green-50 p-4">
                    <p className="text-sm text-gray-500">Payment ID</p>
                    <p className="break-all font-semibold text-green-700">{confirmation.transactionId}</p>
                </div>
            )}
            <p className="mt-4 text-sm text-gray-500">
                Opening your pending parcel in {redirectSeconds} seconds...
            </p>
            <Link
                to={`/dashbord/pending-parcel/${confirmation.parcelId}`}
                state={{ paymentId: confirmation.transactionId }}
                className="btn btn-neutral mt-6"
            >
                View pending parcel now
            </Link>
        </div>
    )
}

export default PaymentSuccess
