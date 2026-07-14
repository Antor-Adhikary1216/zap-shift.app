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
        <section className="mx-auto my-4 w-full max-w-[1400px] min-w-0 rounded-2xl bg-white px-4 py-8 text-[#03373D] sm:my-6 sm:rounded-[30px] sm:px-10 sm:py-12 lg:px-20 lg:py-20">
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl lg:text-[58px]">Track Your Consignment</h1>
            <p className="mt-4 text-base text-[#606060]">Now you can easily track your consignment</p>

            <form onSubmit={handleSubmit} className="mt-8 grid w-full max-w-[600px] gap-3 sm:mt-14 sm:flex sm:rounded-full sm:bg-[#F1F3F5] sm:p-1.5">
                <label className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-[#F1F3F5] px-4 sm:min-h-0 sm:gap-4 sm:bg-transparent">
                    <FaSearch className="shrink-0 text-lg text-black" />
                    <span className="sr-only">Tracking ID</span>
                    <input
                        value={trackingId}
                        onChange={(event) => setTrackingId(event.target.value)}
                        placeholder="Search tracking code here"
                        className="min-w-0 flex-1 bg-transparent py-3 text-base text-black outline-none sm:text-sm"
                    />
                </label>
                <button type="submit" disabled={loading} className="btn min-h-12 w-full rounded-full border-0 bg-[#CAEB66] px-7 py-3 text-base font-bold text-black shadow-none sm:h-auto sm:min-h-0 sm:w-auto sm:px-10">
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <p role="alert" className="mt-5 text-sm font-semibold text-red-600">{error}</p>}

            {parcel && (
                <div className="mt-9 min-w-0 border-t border-[#E5E7EB] pt-9 sm:mt-12 sm:pt-12">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <article className="min-w-0 rounded-2xl bg-[#F1F4F6] p-4 sm:rounded-[42px] sm:p-11 lg:min-h-[560px]">
                            <h2 className="text-2xl font-bold leading-tight sm:text-4xl">Product details</h2>
                            <div className="mt-6 min-w-0 space-y-2 break-words text-sm text-black sm:mt-7 sm:space-y-1 sm:text-base">
                                <p>{formatDate(parcel.createdAt)}</p>
                                <p>ID : <span className="break-all text-[#7A7A7A]">{parcel._id}</span></p>
                                <p>Payment ID : <span className="break-all text-[#7A7A7A]">{parcel.transactionId || 'Not available'}</span></p>
                                <p>Tracking Code : <span className="break-all text-[#7A7A7A]">{parcel.trackingId}</span></p>
                            </div>
                            <div className="mt-8 space-y-2 break-words text-sm text-black sm:mt-12 sm:space-y-1 sm:text-base">
                                <p>Name : <span className="text-[#7A7A7A]">{parcel.receiverName || 'Not provided'}</span></p>
                                <p>Address : <span className="text-[#7A7A7A]">{parcel['delibery Address'] || 'Not provided'}</span></p>
                                <p>Phone Number : <span className="text-[#7A7A7A]">{parcel['receiver Contect'] || 'Not provided'}</span></p>
                            </div>
                            <div className="mt-8 space-y-2 break-words text-sm text-black sm:mt-12 sm:space-y-1 sm:text-base">
                                <p>Parcel : <span className="text-[#7A7A7A]">{parcel.parcelName || 'Not provided'}</span></p>
                                <p>Weight : <span className="text-[#7A7A7A]">{parcel.parcelWeight || 'N/A'} KG</span></p>
                                <p>COD : <span className="text-[#7A7A7A]">₹0</span></p>
                                <p className="font-bold text-[#D5A500]">{parcel.deliveryStatus || 'Parcel shipped'}</p>
                            </div>
                        </article>

                        <article className="min-w-0 rounded-2xl bg-[#F1F4F6] p-4 sm:rounded-[42px] sm:p-11 lg:min-h-[560px]">
                            <h2 className="text-2xl font-bold leading-tight sm:text-4xl">Tracking Updates</h2>
                            <div className="mt-8 min-w-0 sm:mt-10">
                                {updates.map((update, index) => (
                                    <div key={`${update.status}-${index}`} className="grid min-w-0 grid-cols-[72px_36px_minmax(0,1fr)] gap-2 text-black sm:grid-cols-[140px_50px_minmax(0,1fr)] sm:gap-6">
                                        <time className="break-words pt-2 text-xs leading-5 sm:text-base">{formatDate(update.createdAt)}</time>
                                        <div className="flex flex-col items-center">
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#DDF4E4] text-base text-[#12AD37] sm:size-11 sm:text-xl"><FaCheck /></span>
                                            {index < updates.length - 1 && <span className="min-h-20 w-px flex-1 bg-[#D9E0E3]" />}
                                        </div>
                                        <div className="min-w-0 pb-9 pt-2 sm:pb-12">
                                            <p className="break-words text-sm font-semibold sm:text-base">{update.status}</p>
                                            <p className="mt-1 break-words text-xs leading-5 text-[#606060] sm:text-sm">{update.message}</p>
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
