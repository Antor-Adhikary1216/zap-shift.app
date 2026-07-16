import { useQuery } from '@tanstack/react-query'
import { FaCommentDots, FaQuoteLeft, FaStar } from 'react-icons/fa'
import DashboardLoader from '../../../Components/LoadingIndicator/DashboardLoader'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'

const formatDate = (date) => date
  ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
  : 'Date not available'

const AdminFeedback = () => {
  const axiosSecure = UseaxiosSecure()
  const { data: feedback = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: async () => {
      const response = await axiosSecure.get('/admin/feedback')
      return response.data
    },
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const averageRating = feedback.length
    ? feedback.reduce((total, item) => total + Number(item.rating || 0), 0) / feedback.length
    : 0

  if (isLoading) {
    return <DashboardLoader message="Loading user feedback..." />
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] min-w-0 bg-base-200/50 p-3 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <div className="shrink-0 rounded-2xl bg-[#03373D] p-3 text-[#CAEB66] sm:p-4">
              <FaCommentDots className="text-xl sm:text-2xl" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#617718]">Admin dashboard</p>
              <h1 className="text-2xl font-bold text-[#03373D] sm:text-4xl">User feedback</h1>
              <p className="mt-1 text-base-content/60">Read every comment submitted through the ZapShift footer.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-auto">
            <div className="rounded-2xl border border-[#DDE9BB] bg-[#F3F9DF] px-4 py-3 text-center sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#617718]">Total</p>
              <p className="mt-1 text-2xl font-bold text-[#03373D]">{feedback.length}</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Average</p>
              <p className="mt-1 flex items-center justify-center gap-1 text-2xl font-bold text-[#03373D]">
                {averageRating.toFixed(1)} <FaStar className="text-base text-amber-400" aria-label="stars" />
              </p>
            </div>
          </div>
        </div>

        {isError && (
          <div className="alert alert-error mt-7 flex-col items-start sm:flex-row sm:items-center">
            <span>{error.response?.data?.message || 'Unable to load user feedback.'}</span>
            <button type="button" className="btn btn-sm" onClick={() => refetch()}>Try again</button>
          </div>
        )}

        {!isError && feedback.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-base-300 bg-base-100 px-5 py-14 text-center shadow-sm sm:px-8 sm:py-20">
            <FaCommentDots className="mx-auto text-5xl text-base-content/20" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold text-[#03373D]">No feedback received yet</h2>
            <p className="mt-2 text-base-content/60">New footer feedback will appear here automatically.</p>
          </div>
        )}

        {!isError && feedback.length > 0 && (
          <ol className="mt-8 space-y-4" aria-label="User feedback, newest first">
            {feedback.map((item, index) => (
              <li key={item._id}>
                <article className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition hover:border-[#C5DD7F] hover:shadow-md">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-6">
                    <div className="flex items-center gap-3 sm:block sm:w-14 sm:shrink-0 sm:text-center">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#03373D] text-sm font-bold text-[#CAEB66] sm:mx-auto">
                        {index + 1}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-base-content/45 sm:mt-2 sm:block">Entry</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h2 className="break-words text-lg font-bold text-[#03373D]">{item.name || 'ZapShift user'}</h2>
                          <p className="break-all text-sm text-base-content/55">{item.email || 'Email not available'}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1" aria-label={`${item.rating || 0} out of 5 stars`}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star} className={star <= Number(item.rating) ? 'text-amber-400' : 'text-base-300'} aria-hidden="true" />
                          ))}
                        </div>
                      </div>

                      <div className="relative mt-5 rounded-2xl bg-[#F7F9F2] px-4 py-4 pl-11 sm:px-5 sm:py-5 sm:pl-12">
                        <FaQuoteLeft className="absolute left-4 top-5 text-[#A8CE36] sm:left-5" aria-hidden="true" />
                        <p className="whitespace-pre-wrap break-words leading-7 text-[#405255]">{item.comment}</p>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 text-xs text-base-content/50 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                        <time dateTime={item.createdAt || undefined}>{formatDate(item.createdAt)}</time>
                        <span className="w-fit rounded-full bg-[#EAF4CA] px-3 py-1 font-semibold capitalize text-[#617718]">{item.status || 'new'}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  )
}

export default AdminFeedback
