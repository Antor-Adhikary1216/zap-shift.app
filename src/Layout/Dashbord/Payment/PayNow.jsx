import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import { FaRupeeSign } from 'react-icons/fa';
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure';

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
        return (
            <span className="loading loading-spinner loading-lg" aria-label="Loading parcel"></span>
        )
    }

    if (isError || !parcel) {
        return (
            <div>
                <h2 className="text-2xl text-red-600">Parcel not found</h2>
                <p>The parcel could not be loaded for payment.</p>
                <Link to="/dashbord/my-parcels" className="btn btn-neutral mt-4">
                    Back to my parcels
                </Link>
            </div>
        )
    }

    const isPaid = parcel.paymentStatus === 'paid'

    return (
        <div>
            <h2 className='text-3xl '>Pay your payment- <br/>
                <p>Prcel Id : {parcel._id}</p>
                parcel Name: <span className='font-bold'>{parcel.parcelName}</span>
            </h2>
            <p className='flex items-center gap-2 text-2xl'>
                parcel amount : {parcel.cost} <span><FaRupeeSign /></span>
            </p>
            <h2 className='my-3 text-2xl font-medium text-gray-700'>please pay</h2>

            {isPaid ? (
                <p className="text-green-500">Paid</p>
            ) : (
                <button
                    type="button"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className='btn bg-amber-400 btn-sm my-5'
                >
                    {isProcessing ? 'Opening checkout...' : 'pay Now'}
                </button>
            )}

            {paymentError && <p className="text-red-500" role="alert">{paymentError}</p>}
        </div>
    )
}

export default PayNow
