import { Navigate, useLocation } from 'react-router'
import FloatingLoader from '../Components/LoadingIndicator/FloatingLoader'
import useAuth from '../Hooks/useAuth/useAuth'
import useUserRole from '../Hooks/useUserRole/useUserRole'

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const { data: roleInfo, isRoleLoading, isError } = useUserRole()
  const location = useLocation()

  if (loading || isRoleLoading) {
    return <><div className="min-h-screen bg-[#F6F8F8]" /><FloatingLoader message="Verifying user access..." /></>
  }

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (isError || roleInfo?.role !== 'user') {
    return <Navigate to={roleInfo?.isAdmin ? '/dashbord/admin-parcels' : '/'} replace />
  }

  return children
}

export default UserRoute
