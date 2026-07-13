import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaUserMinus, FaUserShield } from 'react-icons/fa'
import Swal from 'sweetalert2'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'
import useAuth from '../../../Hooks/useAuth/useAuth'

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeAction, setActiveAction] = useState('')
  const axiosSecure = UseaxiosSecure()
  const { user: currentUser } = useAuth()
  const { data: users = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users-management'],
    queryFn: async () => {
      const response = await axiosSecure.get('/users')
      return response.data
    },
  })

  const getInitial = (user) => (user.name || user.email || 'U').charAt(0).toUpperCase()
  const displayedUsers = [...users].sort((firstUser, secondUser) => {
    const adminOrder = Number(secondUser.role === 'admin') - Number(firstUser.role === 'admin')
    if (adminOrder !== 0) return adminOrder

    const firstJoinedAt = firstUser.createdAt ? new Date(firstUser.createdAt).getTime() : 0
    const secondJoinedAt = secondUser.createdAt ? new Date(secondUser.createdAt).getTime() : 0
    return secondJoinedAt - firstJoinedAt
  })
  const usersPerPage = 10
  const totalPages = Math.max(1, Math.ceil(displayedUsers.length / usersPerPage))
  const activePage = Math.min(currentPage, totalPages)
  const firstUserIndex = (activePage - 1) * usersPerPage
  const paginatedUsers = displayedUsers.slice(firstUserIndex, firstUserIndex + usersPerPage)

  const handleRoleAction = async (selectedUser) => {
    const nextRole = selectedUser.role === 'admin' ? 'user' : 'admin'
    const result = await Swal.fire({
      title: nextRole === 'admin' ? 'Make this user an admin?' : 'Remove administrator access?',
      text: `${selectedUser.name || selectedUser.email} will receive ${nextRole === 'admin' ? 'administrator permissions' : 'standard user permissions'}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#03373D',
      confirmButtonText: nextRole === 'admin' ? 'Make admin' : 'Remove admin',
    })

    if (!result.isConfirmed) return
    setActiveAction(`role-${selectedUser._id}`)
    try {
      const response = await axiosSecure.patch(`/users/${selectedUser._id}/role`, { role: nextRole })
      await refetch()
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: response.data.message, showConfirmButton: false, timer: 2200 })
    } catch (actionError) {
      Swal.fire({ icon: 'error', title: 'Action failed', text: actionError.response?.data?.message || 'Unable to update this user role.' })
    } finally {
      setActiveAction('')
    }
  }

  const handleDeleteAction = async (selectedUser) => {
    const result = await Swal.fire({
      title: 'Delete this user?',
      text: `${selectedUser.name || selectedUser.email} will be permanently removed from ZapShift.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      confirmButtonText: 'Delete user',
    })

    if (!result.isConfirmed) return
    setActiveAction(`delete-${selectedUser._id}`)
    try {
      const response = await axiosSecure.delete(`/users/${selectedUser._id}`)
      await refetch()
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: response.data.message, showConfirmButton: false, timer: 2200 })
    } catch (actionError) {
      Swal.fire({ icon: 'error', title: 'Action failed', text: actionError.response?.data?.message || 'Unable to delete this user.' })
    } finally {
      setActiveAction('')
    }
  }

  if (isLoading) {
    return <div className="flex min-h-72 items-center justify-center"><span className="loading loading-spinner loading-lg" /></div>
  }

  return (
    <section className="p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-[#03373D] sm:text-4xl">All Users: {users.length}</h2>
        <p className="mt-2 text-base-content/60">View registered ZapShift user accounts and their roles.</p>

        {isError && (
          <div className="alert alert-error mt-6">
            {error.response?.data?.message || 'Unable to load user accounts.'}
          </div>
        )}

        {!isError && users.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-base-300 bg-base-100 p-10 text-center">
            <p className="text-lg font-semibold">No registered users found</p>
          </div>
        )}

        {!isError && users.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <table className="table">
              <thead className="bg-base-200 text-sm text-[#03373D]">
                <tr>
                  <th>#</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Admin Actions</th>
                  <th>Other Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={user._id} className={user.role === 'admin' ? 'bg-[#F3F9DF] hover:bg-[#EAF5C7]' : 'hover:bg-base-200/50'}>
                    <th>{firstUserIndex + index + 1}</th>
                    <td>
                      <div className="avatar">
                        <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-[#CAEB66] font-bold text-[#03373D]">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={`${user.name || 'User'} profile`} className="h-full w-full object-cover" />
                          ) : (
                            <span>{getInitial(user)}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap font-semibold text-[#03373D]">{user.name || 'Not provided'}</td>
                    <td className="break-all">{user.email}</td>
                    <td>
                      <span className={`badge capitalize ${user.role === 'admin' ? 'badge-success' : 'badge-ghost'}`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                    </td>
                    <td>
                      {user.email === currentUser?.email ? (
                        <span className="text-xs font-semibold text-base-content/45">Current admin</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRoleAction(user)}
                          disabled={Boolean(activeAction)}
                          className="btn btn-sm whitespace-nowrap border-[#A8CE36] bg-[#F3F9DF] text-[#03373D] hover:bg-[#CAEB66]"
                          title={user.role === 'admin' ? 'Remove admin role' : 'Make admin'}
                        >
                          {activeAction === `role-${user._id}` ? <span className="loading loading-spinner loading-xs" /> : <FaUserShield />}
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      )}
                    </td>
                    <td>
                      {user.email === currentUser?.email ? (
                        <span className="text-xs text-base-content/35">Protected account</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteAction(user)}
                          disabled={Boolean(activeAction)}
                          className="btn btn-sm whitespace-nowrap border-red-200 bg-red-50 text-red-700 hover:border-red-600 hover:bg-red-600 hover:text-white"
                          title="Delete user"
                        >
                          {activeAction === `delete-${user._id}` ? <span className="loading loading-spinner loading-xs" /> : <FaUserMinus />}
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col gap-4 border-t border-base-300 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-base-content/60">
                Showing {firstUserIndex + 1}–{Math.min(firstUserIndex + usersPerPage, displayedUsers.length)} of {displayedUsers.length} users
              </p>

              <div className="join">
                <button
                  type="button"
                  className="btn join-item btn-sm"
                  disabled={activePage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={`btn join-item btn-sm ${page === activePage ? 'bg-[#CAEB66] text-[#03373D]' : ''}`}
                    aria-current={page === activePage ? 'page' : undefined}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="btn join-item btn-sm"
                  disabled={activePage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default UserManagement
