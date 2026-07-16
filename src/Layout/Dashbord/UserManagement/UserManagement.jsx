import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaSearch, FaTimes, FaUserMinus, FaUserShield } from 'react-icons/fa'
import Swal from 'sweetalert2'
import UseaxiosSecure from '../../../Hooks/useAxios/useaxiosSecure'
import DashboardLoader from '../../../Components/LoadingIndicator/DashboardLoader'
import useAuth from '../../../Hooks/useAuth/useAuth'

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeAction, setActiveAction] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const axiosSecure = UseaxiosSecure()
  const { user: currentUser } = useAuth()
  const { data: userPage, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users-management', currentPage, searchTerm],
    queryFn: async () => {
      const response = await axiosSecure.get('/users', {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm.trim() || undefined,
        },
      })
      return response.data
    },
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const getInitial = (user) => (user.name || user.email || 'U').charAt(0).toUpperCase()
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const users = userPage?.users || []
  const filteredUserCount = userPage?.total || 0
  const totalUsers = userPage?.totalUsers || 0
  const usersPerPage = 10
  const totalPages = userPage?.totalPages || 1
  const activePage = Math.min(currentPage, totalPages)
  const firstUserIndex = (activePage - 1) * usersPerPage
  const paginatedUsers = users

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setSearchTerm(searchInput)
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
    setCurrentPage(1)
  }

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
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1)
      } else {
        await refetch()
      }
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: response.data.message, showConfirmButton: false, timer: 2200 })
    } catch (actionError) {
      Swal.fire({ icon: 'error', title: 'Action failed', text: actionError.response?.data?.message || 'Unable to delete this user.' })
    } finally {
      setActiveAction('')
    }
  }

  if (isLoading) {
    return <DashboardLoader message="Loading user accounts..." />
  }

  return (
    <section className="min-w-0 p-3 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-[#03373D] sm:text-4xl">All Users: {totalUsers}</h2>
        <p className="mt-2 text-base-content/60">View registered ZapShift user accounts and their roles.</p>

        {!isError && totalUsers > 0 && (
          <div className="mt-6 max-w-xl">
            <label htmlFor="user-email-search" className="mb-2 block text-sm font-semibold text-[#03373D]">
              Search users by email
            </label>
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" aria-hidden="true" />
                <input
                  id="user-email-search"
                  type="search"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="Type an email address"
                  className="input input-bordered w-full bg-base-100 pl-11 pr-12 focus:border-[#A8CE36] focus:outline-none"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="btn btn-circle btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                    aria-label="Clear email search"
                    title="Clear search"
                  >
                    <FaTimes aria-hidden="true" />
                  </button>
                )}
              </div>
              <button type="submit" className="btn border-[#A8CE36] bg-[#CAEB66] text-[#03373D] hover:bg-[#B8DD4E]">
                <FaSearch aria-hidden="true" />
                Search
              </button>
            </form>
            {normalizedSearchTerm && (
              <p className="mt-2 text-sm text-base-content/60">
                {filteredUserCount} {filteredUserCount === 1 ? 'user' : 'users'} found
              </p>
            )}
          </div>
        )}

        {isError && (
          <div className="alert alert-error mt-6">
            {error.response?.data?.message || 'Unable to load user accounts.'}
          </div>
        )}

        {!isError && !normalizedSearchTerm && totalUsers === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-base-300 bg-base-100 p-6 text-center sm:p-10">
            <p className="text-lg font-semibold">No registered users found</p>
          </div>
        )}

        {!isError && normalizedSearchTerm && filteredUserCount === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-base-300 bg-base-100 p-6 text-center sm:p-10">
            <p className="text-lg font-semibold text-[#03373D]">No users found</p>
            <p className="mt-2 text-sm text-base-content/60">
              No email address matches &quot;{searchTerm.trim()}&quot;.
            </p>
            <button type="button" onClick={clearSearch} className="btn btn-sm mt-5 bg-[#CAEB66] text-[#03373D] hover:bg-[#B8DD4E]">
              Clear search
            </button>
          </div>
        )}

        {!isError && users.length > 0 && (
          <div className="mt-6 space-y-4 md:hidden">
            {paginatedUsers.map((user, index) => (
              <article
                key={user._id}
                className={`rounded-2xl border p-4 shadow-sm ${user.role === 'admin' ? 'border-[#D5E79D] bg-[#F3F9DF]' : 'border-base-300 bg-base-100'}`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#CAEB66] font-bold text-[#03373D]">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={`${user.name || 'User'} profile`} className="h-full w-full object-cover" />
                    ) : (
                      <span>{getInitial(user)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-[#03373D]">{user.name || 'Not provided'}</h3>
                        <p className="break-all text-sm text-base-content/60">{user.email}</p>
                      </div>
                      <span className={`badge shrink-0 capitalize ${user.role === 'admin' ? 'badge-success' : 'badge-ghost'}`}>
                        {user.role || 'user'}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-base-content/50">
                      User {firstUserIndex + index + 1} · Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'not available'}
                    </p>
                  </div>
                </div>

                {user.email === currentUser?.email ? (
                  <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-sm font-semibold text-[#617718]">
                    Current admin · Protected account
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3 min-[390px]:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleRoleAction(user)}
                      disabled={Boolean(activeAction)}
                      className="btn min-h-11 border-[#A8CE36] bg-[#F3F9DF] text-[#03373D] hover:bg-[#CAEB66]"
                    >
                      {activeAction === `role-${user._id}` ? <span className="loading loading-spinner loading-xs" /> : <FaUserShield />}
                      {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAction(user)}
                      disabled={Boolean(activeAction)}
                      className="btn min-h-11 border-red-200 bg-red-50 text-red-700 hover:border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      {activeAction === `delete-${user._id}` ? <span className="loading loading-spinner loading-xs" /> : <FaUserMinus />}
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm">
              <button
                type="button"
                className="btn btn-sm min-h-11"
                disabled={activePage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                Previous
              </button>
              <span className="text-center text-sm font-semibold text-[#03373D]">{activePage} / {totalPages}</span>
              <button
                type="button"
                className="btn btn-sm min-h-11"
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                Next
              </button>
            </div>
            <p className="text-center text-xs text-base-content/55">
              Showing {firstUserIndex + 1}–{Math.min(firstUserIndex + users.length, filteredUserCount)} of {filteredUserCount} users
            </p>
          </div>
        )}

        {!isError && users.length > 0 && (
          <div className="mt-8 hidden max-w-full overflow-x-auto overscroll-x-contain rounded-2xl border border-base-300 bg-base-100 shadow-sm md:block">
            <table className="table min-w-max">
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
                Showing {firstUserIndex + 1}–{Math.min(firstUserIndex + users.length, filteredUserCount)} of {filteredUserCount} users
              </p>

              <div className="join max-w-full overflow-x-auto pb-1">
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
