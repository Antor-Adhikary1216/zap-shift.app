import { Suspense, useEffect, useRef, useState } from 'react'

const DeferredSection = ({ children, minHeight = '24rem' }) => {
  const containerRef = useRef(null)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !('IntersectionObserver' in window)) {
      setShouldRender(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setShouldRender(true)
      observer.disconnect()
    }, {
      rootMargin: '500px 0px',
      threshold: 0.01,
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} style={shouldRender ? undefined : { minHeight }}>
      {shouldRender && (
        <Suspense
          fallback={(
            <div className="flex min-h-48 items-center justify-center" role="status" aria-live="polite">
              <span className="loading loading-spinner loading-md text-[#617718]" aria-hidden="true" />
              <span className="sr-only">Loading this section...</span>
            </div>
          )}
        >
          {children}
        </Suspense>
      )}
    </div>
  )
}

export default DeferredSection
