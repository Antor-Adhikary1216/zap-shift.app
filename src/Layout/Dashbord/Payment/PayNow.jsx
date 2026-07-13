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
            console.error(error)
            setPaymentError(error.response?.data?.message || 'Unable to start payment. Please try again.')
            setIsProcessing(false)
        }
    }

    if (isLoading) {
        return <DashboardLoader message="Preparing parcel payment..." />
    }

    if (isError || !parcel) {
        return (
            <div className="mx-auto my-10 max-w-xl rounded-3xl bg-base-100 p-8 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-error">Parcel not found</h2>
                <p>The parcel could not be loaded for payment.</p>
                <Link to="/dashbord/my-parcels" className="btn btn-neutral mt-4">
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
        <main className="min-h-[calc(100vh-4rem)] bg-base-200/50 p-4 sm:p-8">
            <div className="mx-auto max-w-xl">
                <div className="mb-8 flex items-center gap-4">
                    <div className="rounded-2xl bg-primary p-4 text-primary-content">
                        <FaCreditCard className="text-2xl" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Secure checkout</p>
                        <h1 className="text-3xl font-bold">Pay now</h1>
                        <p className="text-base-content/60">Review the parcel before paying.</p>
                    </div>
                </div>

                <article className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm">
                    <div className="h-2 bg-primary" />
                    <div className="card-body gap-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Parcel payment</p>
                                <h2 className="mt-1 text-2xl font-bold">{parcel.parcelName || 'Unnamed parcel'}</h2>
                                <p className="mt-1 capitalize text-base-content/60">{parcel.parceltype || 'Parcel delivery'}</p>
                            </div>
                            <span className={`badge ${isPaid ? 'badge-success badge-outline' : 'badge-warning'}`}>
                                {isPaid ? 'Paid' : 'Payment pending'}
                            </span>
                        </div>

                        <div className="rounded-2xl bg-base-200 p-4">
                            <p className="text-xs uppercase tracking-wide text-base-content/50">Amount to pay</p>
                            <p className="mt-1 text-3xl font-bold text-primary">{amount}</p>
                        </div>

                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="font-medium text-base-content/50">Parcel ID</dt>
                                <dd className="mt-1 break-all font-mono text-xs">{parcel._id}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-4 border-t border-base-300 pt-3">
                                <dt className="font-medium text-base-content/50">Sender</dt>
                                <dd className="text-right font-medium">{parcel.senderemail || 'Not available'}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-4 border-t border-base-300 pt-3">
                                <dt className="font-medium text-base-content/50">Receiver</dt>
                                <dd className="text-right font-medium">{parcel.receiverName || 'Not available'}</dd>
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
