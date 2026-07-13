const LOADING_EVENT = 'zapshift:global-loading'

let pendingRequests = 0
let latestMessage = 'Loading your data...'

const notify = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(LOADING_EVENT, {
    detail: {
      isLoading: pendingRequests > 0,
      pendingRequests,
      message: latestMessage,
    },
  }))
}

export const startGlobalLoading = (message = 'Loading your data...') => {
  pendingRequests += 1
  latestMessage = message
  notify()
  let completed = false

  return () => {
    if (completed) return
    completed = true
    pendingRequests = Math.max(0, pendingRequests - 1)
    notify()
  }
}

export const getGlobalLoadingState = () => ({
  isLoading: pendingRequests > 0,
  pendingRequests,
  message: latestMessage,
})

export { LOADING_EVENT }
