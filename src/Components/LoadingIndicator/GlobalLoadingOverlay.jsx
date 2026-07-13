import { useEffect, useRef, useState } from 'react'
import { getGlobalLoadingState, LOADING_EVENT } from '../../Utilities/globalLoading'
import FloatingLoader from './FloatingLoader'

const MINIMUM_VISIBLE_TIME = 450

const GlobalLoadingOverlay = () => {
  const initialState = getGlobalLoadingState()
  const [visible, setVisible] = useState(initialState.isLoading)
  const [message, setMessage] = useState(initialState.message)
  const initialLoadingRef = useRef(initialState.isLoading)
  const shownAtRef = useRef(0)
  const hideTimerRef = useRef(null)

  useEffect(() => {
    if (initialLoadingRef.current) shownAtRef.current = Date.now()

    const handleLoadingChange = (event) => {
      const state = event.detail

      if (state.isLoading) {
        if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
        if (!shownAtRef.current) shownAtRef.current = Date.now()
        setMessage(state.message || 'Loading your data...')
        setVisible(true)
        return
      }

      const elapsed = Date.now() - shownAtRef.current
      const remaining = Math.max(0, MINIMUM_VISIBLE_TIME - elapsed)
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false)
        shownAtRef.current = 0
        hideTimerRef.current = null
      }, remaining)
    }

    window.addEventListener(LOADING_EVENT, handleLoadingChange)
    return () => {
      window.removeEventListener(LOADING_EVENT, handleLoadingChange)
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
    }
  }, [])

  if (!visible) return null

  return <FloatingLoader message={message} />
}

export default GlobalLoadingOverlay
