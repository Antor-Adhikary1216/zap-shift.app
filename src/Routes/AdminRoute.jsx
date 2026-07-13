import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router'
import useAuth from '../Hooks/useAuth/useAuth'
import UseaxiosSecure from '../Hooks/useAxios/useaxiosSecure'
import FloatingLoader from '../Components/LoadingIndicator/FloatingLoader'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const axiosSecure = UseaxiosSecure()
  const { data: roleInfo, isLoading } = useQuery({
    queryKey: ['user-role', user?.email],
    enabled: Boolean(user?.email),
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${encodeURIComponent(user.email)}/role`)
      return response.data
    },
  })

  if (loading || isLoading) {
    return <><div className="min-h-screen bg-[#F6F8F8]" /><FloatingLoader message="Verifying administrator access..." /></>
  }

  if (!user) return <Navigate to="/login" replace />
  if (!roleInfo?.isAdmin) return <Navigate to="/dashbord" replace />

  return children
}

export default AdminRoute
