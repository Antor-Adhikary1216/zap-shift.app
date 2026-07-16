import { useEffect } from 'react'
import Swal from 'sweetalert2'
import useAuth from '../../Hooks/useAuth/useAuth'
import zapShiftLogo from '../../assets/logo.png'
import './firstTimeFeatureGuide.css'

let activeGuideAccount = ''

const featureGuideHtml = `
  <div class="zapshift-guide-content">
    <p class="zapshift-guide-intro">
      Here is a quick look at everything you can do with your ZapShift account.
    </p>

    <div class="zapshift-guide-grid">
      <article class="zapshift-guide-card">
        <span class="zapshift-guide-icon" aria-hidden="true">📦</span>
        <div>
          <h3>Send a parcel</h3>
          <p>Enter pickup, receiver, and parcel details to book a new delivery in minutes.</p>
        </div>
      </article>

      <article class="zapshift-guide-card">
        <span class="zapshift-guide-icon" aria-hidden="true">📋</span>
        <div>
          <h3>Manage your parcels</h3>
          <p>Open My Parcels to review every booking, payment state, and delivery status.</p>
        </div>
      </article>

      <article class="zapshift-guide-card">
        <span class="zapshift-guide-icon" aria-hidden="true">📍</span>
        <div>
          <h3>Track deliveries</h3>
          <p>Use a tracking ID to follow the latest parcel location and progress.</p>
        </div>
      </article>

      <article class="zapshift-guide-card">
        <span class="zapshift-guide-icon" aria-hidden="true">💳</span>
        <div>
          <h3>Pay securely</h3>
          <p>Complete pending payments and review previous transactions from your dashboard.</p>
        </div>
      </article>

      <article class="zapshift-guide-card">
        <span class="zapshift-guide-icon" aria-hidden="true">🗺️</span>
        <div>
          <h3>Check coverage and pricing</h3>
          <p>Explore supported delivery areas and estimate the service you need before booking.</p>
        </div>
      </article>

      <article class="zapshift-guide-card">
        <span class="zapshift-guide-icon" aria-hidden="true">🏍️</span>
        <div>
          <h3>Become a rider</h3>
          <p>Submit a rider application and join the ZapShift delivery partner network.</p>
        </div>
      </article>
    </div>

    <div class="zapshift-guide-tip">
      <span aria-hidden="true">✨</span>
      <p><strong>Helpful tip:</strong> Use your dashboard to access parcels, tracking, payments, and account settings from one place.</p>
    </div>
  </div>
`

const FirstTimeFeatureGuide = () => {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading || !user) return undefined

    const accountId = user.uid || user.email
    if (!accountId) return undefined

    const storageKey = `zapshift-feature-guide-seen:${accountId}`
    if (localStorage.getItem(storageKey) || activeGuideAccount === accountId) return undefined

    activeGuideAccount = accountId
    let guideOpened = false
    const firstName = user.displayName?.trim().split(/\s+/)[0]

    const timer = window.setTimeout(() => {
      localStorage.setItem(storageKey, 'true')
      guideOpened = true

      Swal.fire({
        imageUrl: zapShiftLogo,
        imageWidth: 64,
        imageHeight: 64,
        imageAlt: 'ZapShift logo',
        title: firstName ? `Welcome to ZapShift, ${firstName}!` : 'Welcome to ZapShift!',
        html: featureGuideHtml,
        confirmButtonText: 'Start exploring',
        confirmButtonColor: '#03373D',
        showCloseButton: true,
        allowOutsideClick: false,
        buttonsStyling: false,
        customClass: {
          popup: 'zapshift-guide-popup',
          image: 'zapshift-guide-logo',
          title: 'zapshift-guide-title',
          htmlContainer: 'zapshift-guide-html',
          actions: 'zapshift-guide-actions',
          confirmButton: 'zapshift-guide-confirm',
          closeButton: 'zapshift-guide-close',
        },
      }).finally(() => {
        if (activeGuideAccount === accountId) activeGuideAccount = ''
      })
    }, 2200)

    return () => {
      window.clearTimeout(timer)
      if (guideOpened && Swal.isVisible()) Swal.close()
      if (activeGuideAccount === accountId) activeGuideAccount = ''
    }
  }, [loading, user])

  return null
}

export default FirstTimeFeatureGuide
