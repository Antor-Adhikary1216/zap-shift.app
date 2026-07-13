import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router'
import useAuth from '../Hooks/useAuth/useAuth'
import UseaxiosSecure from '../Hooks/useAxios/useaxiosSecure'

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
    return <div className="flex min-h-screen items-center justify-center"><span className="loading loading-spinner loading-lg" /></div>
  }

  if (!user) return <Navigate to="/login" replace />
  if (!roleInfo?.isAdmin) return <Navigate to="/dashbord" replace />

  return children
}

export default AdminRoute
