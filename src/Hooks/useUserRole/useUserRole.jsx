import { useQuery } from '@tanstack/react-query'
import useAuth from '../useAuth/useAuth'
import UseaxiosSecure from '../useAxios/useaxiosSecure'

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth()
  const axiosSecure = UseaxiosSecure()

  const roleQuery = useQuery({
    queryKey: ['user-role', user?.email],
    enabled: !authLoading && Boolean(user?.email),
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${encodeURIComponent(user.email)}/role`)
      return response.data
    },
  })

  return {
    ...roleQuery,
    isAdmin: roleQuery.data?.isAdmin === true,
    isRoleLoading: authLoading || (Boolean(user) && roleQuery.isLoading),
  }
}

export default useUserRole
