import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  FaBars,
  FaBoxOpen,
  FaBoxes,
  FaChevronRight,
  FaCreditCard,
  FaHome,
  FaMapMarkedAlt,
  FaMoneyCheckAlt,
  FaSearch,
  FaSignOutAlt,
  FaUserCheck,
  FaUsersCog,
} from 'react-icons/fa'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import logo from '../../assets/logo.png'
import useAuth from '../../Hooks/useAuth/useAuth'
import UseaxiosSecure from '../../Hooks/useAxios/useaxiosSecure'
import FloatingLoader from '../../Components/LoadingIndicator/FloatingLoader'

const pageTitles = {
  'track-parcel': ['Track parcel', 'Find the latest location and status of a shipment.'],
  'my-parcels': ['My parcels', 'Review and manage all of your parcel requests.'],
  'account-settings': ['Account settings', 'Update your profile and account security.'],
  'payment-history': ['Payment history', 'View your completed parcel payments.'],
  'admin-parcels': ['All parcels', 'Monitor parcel requests from every customer.'],
  'admin-payment-history': ['All payments', 'Review payments completed by all users.'],
  'approved-rider': ['Rider requests', 'Review and manage rider applications.'],
  'user-management': ['User management', 'Manage users, roles, and account access.'],
  coverage: ['Coverage', 'View and search ZapShift delivery coverage areas.'],
  payment: ['Parcel payment', 'Complete payment for your parcel request.'],
  'payment-successful': ['Payment successful', 'Your parcel payment has been confirmed.'],
  'payment-canceld': ['Payment cancelled', 'Your parcel payment was not completed.'],
  'pending-parcel': ['Parcel details', 'Review the current details for this parcel.'],
}

const Dashlayout = () => {
  const { user, Logout } = useAuth()
  const axiosSecure = UseaxiosSecure()
  const location = useLocation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { data: roleInfo, isLoading: isRoleLoading } = useQuery({
    queryKey: ['user-role', user?.email],
    enabled: Boolean(user?.email),
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${encodeURIComponent(user.email)}/role`)
      return res.data
    },
  })

  const { data: parcels = [] } = useQuery({
    queryKey: ['my-parcels', user?.email],
    enabled: Boolean(user?.email) && !isRoleLoading && !roleInfo?.isAdmin,
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels')
      return res.data
    },
  })

  const userNavigation = [
    { to: 'my-parcels', label: 'My parcels', icon: FaBoxOpen, badge: parcels.length || null },
    { to: 'track-parcel', label: 'Track parcel', icon: FaSearch },
    { to: 'payment-history', label: 'Payment history', icon: FaCreditCard },
  ]

  const adminNavigation = [
    { to: 'track-parcel', label: 'Track parcel', icon: FaSearch },
    { to: 'admin-parcels', label: 'All parcels', icon: FaBoxes },
    { to: 'admin-payment-history', label: 'All payments', icon: FaMoneyCheckAlt },
    { to: 'approved-rider', label: 'Rider requests', icon: FaUserCheck },
    { to: 'user-management', label: 'User management', icon: FaUsersCog },
    { to: 'coverage', label: 'Coverage', icon: FaMapMarkedAlt },
  ]

  const navigationItems = roleInfo?.isAdmin ? adminNavigation : userNavigation
  const currentSegment = location.pathname.split('/').filter(Boolean)[1] || ''
  const [pageTitle, pageDescription] = pageTitles[currentSegment] || ['Dashboard', 'Manage your ZapShift activity in one place.']
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'ZapShift user'
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    await Logout()
    navigate('/')
  }

  const closeDrawer = () => setDrawerOpen(false)

  if (isRoleLoading) {
    return <><div className="min-h-screen bg-[#F6F8F8]" /><FloatingLoader message="Loading your dashboard..." /></>
  }

  return (
    <div className="drawer min-h-screen bg-[#F6F8F8] lg:drawer-open">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={(event) => setDrawerOpen(event.target.checked)}
      />

      <div className="drawer-content min-w-0 overflow-x-hidden bg-[#F6F8F8]">
        <header className="sticky top-0 z-30 border-b border-[#DCE5E6] bg-white/95 px-3 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-h-14 min-w-0 items-center justify-between gap-2 sm:gap-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost h-11 min-h-11 w-11 shrink-0 lg:hidden" aria-label="Open dashboard menu">
                <FaBars className="text-xl text-[#03373D]" />
              </label>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#708487] sm:gap-2 sm:text-xs sm:tracking-widest">
                  <span>Dashboard</span>
                  <FaChevronRight className="shrink-0 text-[8px] sm:text-[9px]" />
                  <span className="truncate text-[#617718]">{pageTitle}</span>
                </div>
                <h1 className="mt-1 truncate text-lg font-bold text-[#03373D] sm:text-2xl">{pageTitle}</h1>
                <p className="hidden truncate text-sm text-[#708487] sm:block">{pageDescription}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold text-[#03373D]">{displayName}</p>
                <p className="text-xs capitalize text-[#708487]">{roleInfo?.isAdmin ? 'Administrator' : 'Customer account'}</p>
              </div>
              <Link
                to={roleInfo?.isAdmin ? '/dashbord/user-management' : '/dashbord/account-settings'}
                className="avatar placeholder rounded-full focus:outline-none focus:ring-2 focus:ring-[#03373D] focus:ring-offset-4"
                title={roleInfo?.isAdmin ? 'Open user management' : 'Manage your account'}
                aria-label={roleInfo?.isAdmin ? 'Open user management' : 'Manage your account'}
              >
                <div className="h-10 w-10 overflow-hidden rounded-full bg-[#03373D] text-[#CAEB66] ring-2 ring-[#CAEB66] ring-offset-1 sm:h-11 sm:w-11 sm:ring-offset-2">
                  {user?.photoURL ? <img src={user.photoURL} alt={displayName} /> : <span className="text-sm font-bold">{initials}</span>}
                </div>
              </Link>
            </div>
          </div>
        </header>

        <div className="min-w-0 overflow-x-hidden">
          <Outlet />
        </div>
      </div>

      <aside className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" className="drawer-overlay" aria-label="Close dashboard menu" />
        <div className="flex h-dvh min-h-full w-[min(18rem,88vw)] flex-col bg-[#03373D] text-white">
          <div className="border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5">
            <Link to="/" onClick={closeDrawer} className="inline-flex rounded-xl bg-white px-3 py-2">
              <img src={logo} alt="ZapShift" className="h-9 w-auto object-contain" />
            </Link>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:mt-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold">{displayName}</p>
                  <p className="truncate text-xs text-white/55">{user?.email}</p>
                </div>
                <span className="rounded-full bg-[#CAEB66] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#03373D]">
                  {roleInfo?.isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4 sm:py-6">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Navigation</p>
            <ul className="space-y-2">
              <li>
                <Link to="/" onClick={closeDrawer} className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                  <FaHome className="text-lg" />
                  <span>Back to home</span>
                </Link>
              </li>
              {navigationItems.map(({ to, label, icon: Icon, badge }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={closeDrawer}
                    className={({ isActive }) => `group flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${isActive ? 'bg-[#CAEB66] text-[#03373D] shadow-lg shadow-black/10' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className="text-lg" />
                        <span className="flex-1">{label}</span>
                        {badge ? <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-[#03373D] text-white' : 'bg-white/15 text-white'}`}>{badge}</span> : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 rounded-xl bg-white/5 px-4 py-3 text-xs text-white/50">
              <p className="font-semibold text-white/80">{new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(new Date())}</p>
              <p>{new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</p>
            </div>
            <button onClick={handleLogout} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-white/70 transition hover:bg-red-500/15 hover:text-red-200">
              <FaSignOutAlt className="text-lg" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default Dashlayout
