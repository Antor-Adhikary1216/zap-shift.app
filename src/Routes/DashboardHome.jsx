import { Navigate, useLocation } from 'react-router'
import FloatingLoader from '../Components/LoadingIndicator/FloatingLoader'
import useAuth from '../Hooks/useAuth/useAuth'
import useUserRole from '../Hooks/useUserRole/useUserRole'

const DashboardHome = () => {
  const { user, loading } = useAuth()
  const { isAdmin, isRoleLoading, isError } = useUserRole()
  const location = useLocation()

  if (loading || isRoleLoading) {
    return <><div className="min-h-screen bg-[#F6F8F8]" /><FloatingLoader message="Opening your dashboard..." /></>
  }

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (isError) return <Navigate to="/" replace />

  return <Navigate to={isAdmin ? '/dashbord/admin-parcels' : '/dashbord/my-parcels'} replace />
}

export default DashboardHome
