import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import { FaCreditCard } from 'react-icons/fa';
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure';
import DashboardLoader from '../../../Components/LoadingIndicator/DashboardLoader';

const PayNow = () => {
    const { parcelId } = useParams()
    const axiosSecure = UseaxiosSecure()
    const [paymentError, setPaymentError] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

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

    const handlePayment = async () => {
        setPaymentError('')
        setIsProcessing(true)

        try {
            const paymentInfo = {
                cost: parcel.cost,
                parcelId: parcel._id,
                senderEmail: parcel.senderemail,
                parcelName: parcel.parcelName || 'Parcel delivery',
            }
            const res = await axiosSecure.post('/create-checkout-session', paymentInfo)

            if (!res.data?.url) {
                throw new Error('Checkout URL was not returned')
            }

            window.location.assign(res.data.url)
        } catch (error) {
            setPaymentError(error.response?.data?.message || 'Unable to start payment. Please try again.')
            setIsProcessing(false)
        }
    }

    if (isLoading) {
        return <DashboardLoader message="Preparing parcel payment..." />
    }

    if (isError || !parcel) {
        return (
            <div className="mx-3 my-6 max-w-xl rounded-3xl bg-base-100 p-5 text-center shadow-sm sm:mx-auto sm:my-10 sm:p-8">
                <h2 className="text-xl font-bold text-error sm:text-2xl">Parcel not found</h2>
                <p>The parcel could not be loaded for payment.</p>
                <Link to="/dashbord/my-parcels" className="btn btn-neutral mt-4 min-h-11 w-full sm:w-auto">
                    Back to my parcels
                </Link>
            </div>
        )
    }

    const isPaid = parcel.paymentStatus === 'paid'
    const amount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(Number(parcel.cost || 0))

    return (
        <main className="min-h-[calc(100vh-4rem)] min-w-0 bg-base-200/50 p-3 sm:p-8">
            <div className="mx-auto max-w-xl">
                <div className="mb-6 flex min-w-0 items-start gap-3 sm:mb-8 sm:items-center sm:gap-4">
                    <div className="shrink-0 rounded-2xl bg-primary p-3 text-primary-content sm:p-4">
                        <FaCreditCard className="text-xl sm:text-2xl" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Secure checkout</p>
                        <h1 className="text-2xl font-bold sm:text-3xl">Pay now</h1>
                        <p className="text-base-content/60">Review the parcel before paying.</p>
                    </div>
                </div>

                <article className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm">
                    <div className="h-2 bg-primary" />
                    <div className="card-body gap-5 p-4 sm:p-6">
                        <div className="flex flex-col items-start gap-3 min-[390px]:flex-row min-[390px]:justify-between">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Parcel payment</p>
                                <h2 className="mt-1 text-2xl font-bold">{parcel.parcelName || 'Unnamed parcel'}</h2>
                                <p className="mt-1 capitalize text-base-content/60">{parcel.parceltype || 'Parcel delivery'}</p>
                            </div>
                            <span className={`badge shrink-0 ${isPaid ? 'badge-success badge-outline' : 'badge-warning'}`}>
                                {isPaid ? 'Paid' : 'Payment pending'}
                            </span>
                        </div>

                        <div className="rounded-2xl bg-base-200 p-4">
                            <p className="text-xs uppercase tracking-wide text-base-content/50">Amount to pay</p>
                            <p className="mt-1 break-words text-2xl font-bold text-primary sm:text-3xl">{amount}</p>
                        </div>

                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="font-medium text-base-content/50">Parcel ID</dt>
                                <dd className="mt-1 break-all font-mono text-xs">{parcel._id}</dd>
                            </div>
                            <div className="flex flex-col gap-1 border-t border-base-300 pt-3 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between min-[390px]:gap-4">
                                <dt className="font-medium text-base-content/50">Sender</dt>
                                <dd className="break-all font-medium min-[390px]:text-right">{parcel.senderemail || 'Not available'}</dd>
                            </div>
                            <div className="flex flex-col gap-1 border-t border-base-300 pt-3 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between min-[390px]:gap-4">
                                <dt className="font-medium text-base-content/50">Receiver</dt>
                                <dd className="break-words font-medium min-[390px]:text-right">{parcel.receiverName || 'Not available'}</dd>
                            </div>
                        </dl>

                        {paymentError && (
                            <div className="alert alert-error" role="alert">{paymentError}</div>
                        )}

                        <div className="card-actions mt-1">
                            {isPaid ? (
                                <Link to="/dashbord/payment-history" className="btn btn-success w-full">
                                    View payment history
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="btn btn-primary w-full"
                                >
                                    {isProcessing && <span className="loading loading-spinner loading-sm" />}
                                    {isProcessing ? 'Opening secure checkout...' : `Pay ${amount}`}
                                </button>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </main>
    )
}

export default PayNow
