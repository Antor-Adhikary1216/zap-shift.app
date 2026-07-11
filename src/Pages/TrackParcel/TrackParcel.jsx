import { useEffect, useState } from 'react'
import { FaCheck, FaSearch } from 'react-icons/fa'
import { useSearchParams } from 'react-router'
import UseaxiosSecure from '../../Hooks/useAxios/useaxiosSecure'

const formatDate = (value) => {
    if (!value) return 'Not available'
    return new Intl.DateTimeFormat('en-US', {
        month: 'short', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(value))
}

const TrackParcel = () => {
    const axiosSecure = UseaxiosSecure()
    const [searchParams, setSearchParams] = useSearchParams()
    const [trackingId, setTrackingId] = useState(searchParams.get('trackingId') || '')
    const [parcel, setParcel] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const trackParcel = async (code) => {
        const normalizedCode = code.trim().toUpperCase()
        if (!normalizedCode) {
            setError('Enter your tracking ID to find the parcel.')
            return
        }

        setLoading(true)
        setError('')
        setParcel(null)
        try {
            const res = await axiosSecure.get(`/tracking/${encodeURIComponent(normalizedCode)}`)
            setParcel(res.data)
            setTrackingId(normalizedCode)
            setSearchParams({ trackingId: normalizedCode })
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to track this parcel right now.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const initialTrackingId = searchParams.get('trackingId')
        // The URL is an external source; load its parcel when this route opens.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (initialTrackingId) trackParcel(initialTrackingId)
        // Run only when the page first receives a tracking ID.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault()
        trackParcel(trackingId)
    }

    const updates = parcel?.trackingUpdates?.length
        ? [...parcel.trackingUpdates].reverse()
        : parcel ? [{ status: parcel.deliveryStatus || 'Parcel shipped', message: 'Your parcel is currently in transit.', createdAt: parcel.paidAt }] : []

    return (
        <section className="mx-auto my-6 w-full max-w-[1400px] rounded-[30px] bg-white px-5 py-12 text-[#03373D] sm:px-10 lg:px-20 lg:py-20">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-[58px]">Track Your Consignment</h1>
            <p className="mt-4 text-base text-[#606060]">Now you can easily track your consignment</p>

            <form onSubmit={handleSubmit} className="mt-12 flex max-w-[600px] rounded-full bg-[#F1F3F5] p-1.5 sm:mt-14">
                <label className="flex min-w-0 flex-1 items-center gap-4 px-4">
                    <FaSearch className="shrink-0 text-lg text-black" />
                    <span className="sr-only">Tracking ID</span>
                    <input
                        value={trackingId}
                        onChange={(event) => setTrackingId(event.target.value)}
                        placeholder="Search tracking code here"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm text-black outline-none"
                    />
                </label>
                <button disabled={loading} className="btn h-auto min-h-0 rounded-full border-0 bg-[#CAEB66] px-7 py-3 text-base font-bold text-black shadow-none sm:px-10">
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <p role="alert" className="mt-5 text-sm font-semibold text-red-600">{error}</p>}

            {parcel && (
                <div className="mt-12 border-t border-[#E5E7EB] pt-12">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <article className="min-h-[560px] rounded-[42px] bg-[#F1F4F6] p-7 sm:p-11">
                            <h2 className="text-3xl font-bold sm:text-4xl">Product details</h2>
                            <div className="mt-7 space-y-1 text-base text-black">
                                <p>{formatDate(parcel.createdAt)}</p>
                                <p>ID : <span className="text-[#7A7A7A]">{parcel._id}</span></p>
                                <p>Payment ID : <span className="text-[#7A7A7A]">{parcel.transactionId || 'Not available'}</span></p>
                                <p>Tracking Code : <span className="break-all text-[#7A7A7A]">{parcel.trackingId}</span></p>
                            </div>
                            <div className="mt-12 space-y-1 text-base text-black">
                                <p>Name : <span className="text-[#7A7A7A]">{parcel.receiverName || 'Not provided'}</span></p>
                                <p>Address : <span className="text-[#7A7A7A]">{parcel['delibery Address'] || 'Not provided'}</span></p>
                                <p>Phone Number : <span className="text-[#7A7A7A]">{parcel['receiver Contect'] || 'Not provided'}</span></p>
                            </div>
                            <div className="mt-12 space-y-1 text-base text-black">
                                <p>Parcel : <span className="text-[#7A7A7A]">{parcel.parcelName || 'Not provided'}</span></p>
                                <p>Weight : <span className="text-[#7A7A7A]">{parcel.parcelWeight || 'N/A'} KG</span></p>
                                <p>COD : <span className="text-[#7A7A7A]">₹0</span></p>
                                <p className="font-bold text-[#D5A500]">{parcel.deliveryStatus || 'Parcel shipped'}</p>
                            </div>
                        </article>

                        <article className="min-h-[560px] rounded-[42px] bg-[#F1F4F6] p-7 sm:p-11">
                            <h2 className="text-3xl font-bold sm:text-4xl">Tracking Updates</h2>
                            <div className="mt-10">
                                {updates.map((update, index) => (
                                    <div key={`${update.status}-${index}`} className="grid grid-cols-[110px_44px_1fr] gap-4 text-black sm:grid-cols-[140px_50px_1fr] sm:gap-6">
                                        <time className="pt-2 text-sm sm:text-base">{formatDate(update.createdAt)}</time>
                                        <div className="flex flex-col items-center">
                                            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#DDF4E4] text-xl text-[#12AD37]"><FaCheck /></span>
                                            {index < updates.length - 1 && <span className="min-h-20 w-px flex-1 bg-[#D9E0E3]" />}
                                        </div>
                                        <div className="pb-12 pt-2">
                                            <p className="font-semibold">{update.status}</p>
                                            <p className="mt-1 text-sm text-[#606060]">{update.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>
                </div>
            )}
        </section>
    )
}

export default TrackParcel
