import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  updateEmail,
  updatePassword,
} from 'firebase/auth'
import { FaCheck, FaCloudUploadAlt, FaEnvelope, FaEye, FaEyeSlash, FaLock, FaMinus, FaPlus, FaSave, FaShieldAlt, FaTimes, FaUser } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { Link } from 'react-router'
import { auth } from '../../../../FireBase/Firebase.config'
import useAuth from '../../../Hooks/useAuth/useAuth'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'

const getErrorMessage = (error) => {
  const messages = {
    'auth/wrong-password': 'The current password is incorrect.',
    'auth/invalid-credential': 'The current password is incorrect.',
    'auth/requires-recent-login': 'Please log out, log in again, and retry this security change.',
    'auth/email-already-in-use': 'Another account already uses this email address.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Your new password must contain at least 6 characters.',
    'auth/operation-not-allowed': 'This account provider does not allow that change.',
    'auth/popup-closed-by-user': 'Google verification was cancelled.',
  }

  return error?.response?.data?.message || messages[error?.code] || error?.message || 'Unable to update your account.'
}

const showSuccess = (message) => Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'success',
  title: message,
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
})

const CROP_SIZE = 300
const OUTPUT_SIZE = 600
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value))

const PasswordInput = ({ label, value, onChange, visible, onToggle, placeholder, autoComplete }) => (
  <label className="form-control w-full">
    <span className="mb-2 text-sm font-semibold text-[#03373D]">{label}</span>
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="input input-bordered w-full border-[#CBD8DA] bg-white pr-12 focus:border-[#617718] focus:outline-none"
        required
      />
      <button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#708487] hover:text-[#03373D]" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}>
        {visible ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  </label>
)

const AccountSettings = () => {
  const { user, updetedUserProfile } = useAuth()
  const axiosSecure = UseaxiosSecure()
  const queryClient = useQueryClient()
  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
  })
  const [profilePassword, setProfilePassword] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [cropSource, setCropSource] = useState('')
  const [cropFileName, setCropFileName] = useState('profile-photo.jpg')
  const [cropDimensions, setCropDimensions] = useState({ width: 0, height: 0 })
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 })
  const [cropZoom, setCropZoom] = useState(1)
  const [isApplyingCrop, setIsApplyingCrop] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [visibility, setVisibility] = useState({ profile: false, current: false, next: false, confirm: false })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const cropImageRef = useRef(null)
  const dragStartRef = useRef(null)

  const hasPasswordProvider = user?.providerData?.some((provider) => provider.providerId === 'password')
  const providerLabel = hasPasswordProvider ? 'Email and password' : 'Google account'
  const initials = (profile.name || user?.email || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const toggleVisibility = (field) => {
    setVisibility((current) => ({ ...current, [field]: !current[field] }))
  }

  const selectProfileImage = (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      Swal.fire({ icon: 'warning', title: 'Choose an image file', text: 'Select a JPG, PNG, WebP, or another supported image.' })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setCropSource(reader.result)
      setCropFileName(file.name || 'profile-photo.jpg')
      setCropDimensions({ width: 0, height: 0 })
      setCropPosition({ x: 0, y: 0 })
      setCropZoom(1)
    }
    reader.readAsDataURL(file)
  }

  const getCropBounds = (zoomValue = cropZoom) => {
    if (!cropDimensions.width || !cropDimensions.height) return { x: 0, y: 0, scale: 1 }

    const scale = Math.max(CROP_SIZE / cropDimensions.width, CROP_SIZE / cropDimensions.height) * zoomValue
    return {
      x: Math.max(0, (cropDimensions.width * scale - CROP_SIZE) / 2),
      y: Math.max(0, (cropDimensions.height * scale - CROP_SIZE) / 2),
      scale,
    }
  }

  const handleCropPointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      imageX: cropPosition.x,
      imageY: cropPosition.y,
    }
  }

  const handleCropPointerMove = (event) => {
    if (!dragStartRef.current) return
    const bounds = getCropBounds()
    const nextX = dragStartRef.current.imageX + event.clientX - dragStartRef.current.pointerX
    const nextY = dragStartRef.current.imageY + event.clientY - dragStartRef.current.pointerY
    setCropPosition({
      x: clamp(nextX, -bounds.x, bounds.x),
      y: clamp(nextY, -bounds.y, bounds.y),
    })
  }

  const stopCropDragging = (event) => {
    dragStartRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handleZoomChange = (event) => {
    const nextZoom = Number(event.target.value)
    const bounds = getCropBounds(nextZoom)
    setCropZoom(nextZoom)
    setCropPosition((current) => ({
      x: clamp(current.x, -bounds.x, bounds.x),
      y: clamp(current.y, -bounds.y, bounds.y),
    }))
  }

  const closeCropEditor = () => {
    setCropSource('')
    setCropPosition({ x: 0, y: 0 })
    setCropZoom(1)
    dragStartRef.current = null
  }

  const applyPhotoCrop = async () => {
    const image = cropImageRef.current
    if (!image || !cropDimensions.width || !cropDimensions.height) return

    setIsApplyingCrop(true)
    try {
      const { scale } = getCropBounds()
      const displayedWidth = cropDimensions.width * scale
      const displayedHeight = cropDimensions.height * scale
      const sourceX = ((displayedWidth - CROP_SIZE) / 2 - cropPosition.x) / scale
      const sourceY = ((displayedHeight - CROP_SIZE) / 2 - cropPosition.y) / scale
      const sourceSize = CROP_SIZE / scale
      const canvas = document.createElement('canvas')
      canvas.width = OUTPUT_SIZE
      canvas.height = OUTPUT_SIZE
      const context = canvas.getContext('2d')
      context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE)

      const croppedBlob = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('The adjusted photo could not be created.')), 'image/jpeg', 0.92)
      })
      const safeName = cropFileName.replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]+/gi, '-') || 'profile-photo'
      const croppedFile = new File([croppedBlob], `${safeName}-adjusted.jpg`, { type: 'image/jpeg' })

      setSelectedImage(croppedFile)
      setImagePreview(canvas.toDataURL('image/jpeg', 0.92))
      closeCropEditor()
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Unable to adjust photo', text: getErrorMessage(error) })
    } finally {
      setIsApplyingCrop(false)
    }
  }

  const handleImageDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    selectProfileImage(event.dataTransfer.files?.[0])
  }

  const reauthenticate = async (currentPassword) => {
    if (!auth.currentUser) throw new Error('No authenticated account is available.')

    if (hasPasswordProvider) {
      if (!currentPassword) throw new Error('Enter your current password to continue.')
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      return
    }

    await reauthenticateWithPopup(auth.currentUser, new GoogleAuthProvider())
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    const name = profile.name.trim()
    const email = profile.email.trim().toLowerCase()
    let photoURL = profile.photoURL.trim()
    const emailChanged = email !== user?.email?.toLowerCase()

    if (name.length < 2) {
      return Swal.fire({ icon: 'warning', title: 'Enter your full name', text: 'Your name must contain at least 2 characters.' })
    }

    setSavingProfile(true)
    try {
      if (selectedImage) {
        const imageHostKey = import.meta.env.VITE_image_host
        if (!imageHostKey) throw new Error('Profile image upload is not configured.')

        const imageData = new FormData()
        imageData.append('image', selectedImage)
        const imageResponse = await axios.post(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, imageData)
        photoURL = imageResponse.data?.data?.display_url || ''
        if (!photoURL) throw new Error('The profile image could not be uploaded.')
      }

      if (emailChanged) {
        await reauthenticate(profilePassword)
        await updateEmail(auth.currentUser, email)
      }

      await updetedUserProfile({ displayName: name, photoURL: photoURL || null })
      await auth.currentUser.getIdToken(true)
      await axiosSecure.patch('/users/profile', { name, email, photoURL })
      await queryClient.invalidateQueries({ queryKey: ['user-role'] })
      await queryClient.invalidateQueries({ queryKey: ['my-parcels'] })
      setProfilePassword('')
      setProfile((current) => ({ ...current, photoURL }))
      setSelectedImage(null)
      setImagePreview('')
      showSuccess('Account profile updated successfully.')
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Profile update failed', text: getErrorMessage(error) })
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()

    if (passwords.next.length < 6) {
      return Swal.fire({ icon: 'warning', title: 'Password is too short', text: 'Use at least 6 characters.' })
    }

    if (passwords.next !== passwords.confirm) {
      return Swal.fire({ icon: 'warning', title: 'Passwords do not match', text: 'Re-enter the same new password in both fields.' })
    }

    setSavingPassword(true)
    try {
      await reauthenticate(passwords.current)
      await updatePassword(auth.currentUser, passwords.next)
      setPasswords({ current: '', next: '', confirm: '' })
      showSuccess('Password changed successfully.')
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Password update failed', text: getErrorMessage(error) })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-5.5rem)] min-w-0 bg-[#F6F8F8] p-3 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl bg-[#03373D] p-5 text-white shadow-xl shadow-[#03373D]/10 sm:rounded-3xl sm:p-6">
            <div className="flex flex-col items-center text-center">
              <div className="avatar placeholder">
                <div className="h-28 w-28 overflow-hidden rounded-full bg-white/10 text-3xl font-bold text-[#CAEB66] ring-4 ring-[#CAEB66] ring-offset-4 ring-offset-[#03373D]">
                  {imagePreview || profile.photoURL ? <img src={imagePreview || profile.photoURL} alt={profile.name || 'Account profile'} /> : <span>{initials}</span>}
                </div>
              </div>
              <h2 className="mt-6 text-2xl font-bold">{profile.name || 'Your account'}</h2>
              <p className="mt-1 break-all text-sm text-white/60">{profile.email}</p>
              <span className="mt-4 rounded-full bg-[#CAEB66] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#03373D]">Customer account</span>
            </div>

            <div className="mt-7 space-y-3 border-t border-white/10 pt-6 text-sm">
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3"><FaShieldAlt className="text-[#CAEB66]" /><div><p className="text-xs text-white/45">Sign-in provider</p><p className="font-semibold">{providerLabel}</p></div></div>
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3"><FaEnvelope className="text-[#CAEB66]" /><div className="min-w-0"><p className="text-xs text-white/45">Email status</p><p className="font-semibold">{user?.emailVerified ? 'Verified email' : 'Email not verified'}</p></div></div>
            </div>
          </aside>

          <div className="space-y-6">
            <form onSubmit={handleProfileSubmit} className="rounded-2xl border border-[#DCE5E6] bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
              <div className="mb-6 flex items-start gap-3 border-b border-[#E6ECEC] pb-5 sm:gap-4">
                <div className="shrink-0 rounded-2xl bg-[#F3F9DF] p-3 text-[#617718]"><FaUser className="text-xl" /></div>
                <div className="min-w-0"><h2 className="text-xl font-bold text-[#03373D] sm:text-2xl">Profile information</h2><p className="mt-1 text-sm text-[#708487]">Update how your account appears across ZapShift.</p></div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="form-control w-full">
                  <span className="mb-2 text-sm font-semibold text-[#03373D]">Username</span>
                  <div className="relative"><FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8CA0A2]" /><input type="text" value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} className="input input-bordered w-full border-[#CBD8DA] bg-white pl-11 focus:border-[#617718] focus:outline-none" placeholder="Your full name" required /></div>
                </label>
                <label className="form-control w-full">
                  <span className="mb-2 text-sm font-semibold text-[#03373D]">Email address</span>
                  <div className="relative"><FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8CA0A2]" /><input type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} className="input input-bordered w-full border-[#CBD8DA] bg-white pl-11 focus:border-[#617718] focus:outline-none" placeholder="you@example.com" required /></div>
                </label>
                <div className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-[#03373D]">Profile photo</span>
                  <label
                    htmlFor="account-profile-image"
                    onDragEnter={(event) => { event.preventDefault(); setIsDragging(true) }}
                    onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
                    onDragLeave={(event) => { event.preventDefault(); setIsDragging(false) }}
                    onDrop={handleImageDrop}
                    className={`group relative flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-6 text-center transition ${isDragging ? 'border-[#617718] bg-[#F3F9DF]' : 'border-[#CBD8DA] bg-[#F8FAFA] hover:border-[#9EB64D] hover:bg-[#F3F9DF]/50'}`}
                  >
                    <div className="rounded-full bg-[#EAF4C8] p-4 text-[#617718] transition group-hover:scale-105"><FaCloudUploadAlt className="text-3xl" /></div>
                    <p className="mt-4 font-bold text-[#03373D]">Drag and drop your photo here</p>
                    <p className="mt-1 text-sm text-[#708487]">or click to browse from your device</p>
                    <p className="mt-3 text-xs text-[#8CA0A2]">JPG, PNG, WebP, or another supported image format</p>
                    <input
                      id="account-profile-image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => selectProfileImage(event.target.files?.[0])}
                    />
                  </label>
                  {selectedImage && (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F3F9DF] px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#03373D]">{selectedImage.name}</p>
                        <p className="text-xs text-[#708487]">Previewed in your current profile image.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setSelectedImage(null); setImagePreview('') }}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        <FaTimes /> Remove
                      </button>
                    </div>
                  )}
                </div>
                {profile.email.trim().toLowerCase() !== user?.email?.toLowerCase() && hasPasswordProvider && (
                  <div className="sm:col-span-2">
                    <PasswordInput label="Current password" value={profilePassword} onChange={(event) => setProfilePassword(event.target.value)} visible={visibility.profile} onToggle={() => toggleVisibility('profile')} placeholder="Required to change your email" autoComplete="current-password" />
                  </div>
                )}
                {profile.email.trim().toLowerCase() !== user?.email?.toLowerCase() && !hasPasswordProvider && (
                  <div className="alert border-0 bg-[#F3F9DF] text-[#03373D] sm:col-span-2"><FaShieldAlt /><span>Google will ask you to confirm your identity before changing your email.</span></div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button type="submit" disabled={savingProfile} className="btn min-h-11 w-full border-0 bg-[#CAEB66] px-6 font-bold text-[#03373D] hover:bg-[#B9DB55] sm:w-auto">
                  {savingProfile ? <span className="loading loading-spinner loading-sm" /> : <FaSave />} Save profile
                </button>
              </div>
            </form>

            <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-[#DCE5E6] bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
              <div className="mb-6 flex items-start gap-3 border-b border-[#E6ECEC] pb-5 sm:gap-4">
                <div className="shrink-0 rounded-2xl bg-[#FFF4E5] p-3 text-[#B66A00]"><FaLock className="text-xl" /></div>
                <div className="min-w-0 flex-1"><h2 className="text-xl font-bold text-[#03373D] sm:text-2xl">Password and security</h2><p className="mt-1 text-sm text-[#708487]">Choose a strong password you do not use elsewhere.</p></div>
                <Link
                  to={`/forgot-password?email=${encodeURIComponent(user?.email || '')}`}
                  className="hidden shrink-0 rounded-xl bg-[#F3F9DF] px-4 py-2 text-sm font-bold text-[#617718] transition hover:bg-[#E7F2BC] sm:inline-flex"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#DCE8B4] bg-[#F8FBEF] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-[#03373D]">Forgot your current password?</p>
                  <p className="mt-1 text-sm text-[#708487]">Receive a 6-digit verification code at {user?.email}.</p>
                </div>
                <Link
                  to={`/forgot-password?email=${encodeURIComponent(user?.email || '')}`}
                  className="btn btn-sm min-h-11 w-full border-0 bg-[#CAEB66] font-bold text-[#03373D] hover:bg-[#B9DB55] sm:hidden"
                >
                  Reset password
                </Link>
              </div>

              {!hasPasswordProvider && <div className="alert mb-5 border-0 bg-[#F3F9DF] text-[#03373D]"><FaShieldAlt /><span>You will verify through Google before setting a password.</span></div>}
              <div className="grid gap-5 sm:grid-cols-2">
                {hasPasswordProvider && <div className="sm:col-span-2"><PasswordInput label="Current password" value={passwords.current} onChange={(event) => setPasswords((current) => ({ ...current, current: event.target.value }))} visible={visibility.current} onToggle={() => toggleVisibility('current')} placeholder="Enter your current password" autoComplete="current-password" /></div>}
                <PasswordInput label="New password" value={passwords.next} onChange={(event) => setPasswords((current) => ({ ...current, next: event.target.value }))} visible={visibility.next} onToggle={() => toggleVisibility('next')} placeholder="At least 6 characters" autoComplete="new-password" />
                <PasswordInput label="Confirm new password" value={passwords.confirm} onChange={(event) => setPasswords((current) => ({ ...current, confirm: event.target.value }))} visible={visibility.confirm} onToggle={() => toggleVisibility('confirm')} placeholder="Repeat your new password" autoComplete="new-password" />
              </div>

              <div className="mt-6 flex justify-end">
                <button type="submit" disabled={savingPassword} className="btn min-h-11 w-full border-0 bg-[#03373D] px-6 font-bold text-white hover:bg-[#064D55] sm:w-auto">
                  {savingPassword ? <span className="loading loading-spinner loading-sm" /> : <FaLock />} Change password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {cropSource && (
        <div className="modal modal-open z-50" role="dialog" aria-modal="true" aria-labelledby="adjust-photo-title">
          <div className="modal-box mx-2 max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-lg overflow-y-auto p-0">
            <div className="flex items-center justify-between gap-3 border-b border-[#E6ECEC] px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <h2 id="adjust-photo-title" className="text-lg font-bold text-[#03373D] sm:text-xl">Adjust profile photo</h2>
                <p className="mt-1 text-sm text-[#708487]">Drag to reposition and use the slider to zoom.</p>
              </div>
              <button type="button" onClick={closeCropEditor} className="btn btn-circle btn-ghost min-h-11 shrink-0" aria-label="Close photo editor"><FaTimes /></button>
            </div>

            <div className="bg-[#EEF2F2] px-2 py-6 sm:px-8 sm:py-7">
              <div
                className="relative mx-auto touch-none cursor-grab overflow-hidden rounded-full bg-[#CDD7D8] shadow-xl active:cursor-grabbing"
                style={{ width: CROP_SIZE, height: CROP_SIZE }}
                onPointerDown={handleCropPointerDown}
                onPointerMove={handleCropPointerMove}
                onPointerUp={stopCropDragging}
                onPointerCancel={stopCropDragging}
              >
                <img
                  ref={cropImageRef}
                  src={cropSource}
                  alt="Adjustable profile preview"
                  draggable="false"
                  onLoad={(event) => setCropDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
                  className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
                  style={cropDimensions.width ? {
                    width: cropDimensions.width * getCropBounds().scale,
                    height: cropDimensions.height * getCropBounds().scale,
                    transform: `translate(calc(-50% + ${cropPosition.x}px), calc(-50% + ${cropPosition.y}px))`,
                  } : undefined}
                />
                <div className="pointer-events-none absolute inset-0 rounded-full border-4 border-white/90 shadow-[inset_0_0_0_1px_rgba(3,55,61,0.2)]" />
                <div className="pointer-events-none absolute inset-x-0 top-1/3 border-t border-white/35" />
                <div className="pointer-events-none absolute inset-x-0 top-2/3 border-t border-white/35" />
                <div className="pointer-events-none absolute inset-y-0 left-1/3 border-l border-white/35" />
                <div className="pointer-events-none absolute inset-y-0 left-2/3 border-l border-white/35" />
              </div>

              <div className="mx-auto mt-6 flex max-w-sm items-center gap-4">
                <FaMinus className="shrink-0 text-[#617718]" />
                <input type="range" min="1" max="3" step="0.01" value={cropZoom} onChange={handleZoomChange} className="range range-xs flex-1 [--range-fill:0]" aria-label="Photo zoom" />
                <FaPlus className="shrink-0 text-[#617718]" />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 px-4 py-4 min-[390px]:flex-row min-[390px]:justify-end sm:px-5">
              <button type="button" onClick={closeCropEditor} className="btn btn-ghost min-h-11">Cancel</button>
              <button type="button" onClick={applyPhotoCrop} disabled={isApplyingCrop || !cropDimensions.width} className="btn min-h-11 border-0 bg-[#CAEB66] font-bold text-[#03373D] hover:bg-[#B9DB55]">
                {isApplyingCrop ? <span className="loading loading-spinner loading-sm" /> : <FaCheck />} Apply photo
              </button>
            </div>
          </div>
          <button type="button" className="modal-backdrop cursor-default" onClick={closeCropEditor} aria-label="Close photo editor" />
        </div>
      )}
    </main>
  )
}

export default AccountSettings
