'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Users } from 'lucide-react'
import { UserFormModal } from '@/components/dashboard/user-form-modal'
import { PageHeader } from '@/components/dashboard/page-header'
import { PageLoader } from '@/components/dashboard/page-loader'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { EmptyState } from '@/components/dashboard/empty-state'
import { AlertModalHeader } from '@/components/dashboard/modal-header'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getAuthUsers, AuthUser, deleteAuthUser } from '@/app/lib/api'
import { useAuth } from '@/app/contexts/auth-context'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<AuthUser[]>([])

  useEffect(() => {
    if (user && user.role === 'moderator') {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user && user.role === 'moderator') {
    return null
  }
  const [loading, setLoading] = useState(true)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | number | null>(null)
  const [errorAlertOpen, setErrorAlertOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchUsers = async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await getAuthUsers(token)
      setUsers(response.results)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  const handleAddUser = () => {
    setEditingUser(null)
    setUserModalOpen(true)
  }

  const handleEditUser = (user: AuthUser) => {
    setEditingUser(user)
    setUserModalOpen(true)
  }

  const handleDeleteUser = (id: string | number) => {
    setUserToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!token || !userToDelete) return
    try {
      await deleteAuthUser(token, userToDelete.toString())
      await fetchUsers()
    } catch (error: any) {
      console.error('Error deleting user:', error)
      let msg = 'An error occurred while deleting the user.'
      if (typeof error === 'object' && error !== null) {
        if (error.detail) msg = error.detail
      }
      setErrorMessage(msg)
      setErrorAlertOpen(true)
    } finally {
      setDeleteConfirmOpen(false)
      setUserToDelete(null)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Page Header */}
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        description="Manage users and system configurations"
        actions={
          <Button
            onClick={handleAddUser}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 whitespace-nowrap text-sm sm:text-base px-4 py-2 h-10 sm:h-11 rounded-lg cursor-pointer shadow-lg shadow-primary/15"
          >
            <Plus size={20} />
            Add User
          </Button>
        }
      />

      {/* Users Table - Responsive */}
      <Card className="border-border/80 overflow-hidden shadow-warm p-0 gap-0">
        <div className="p-4 sm:p-5 border-b border-border/70 bg-warm-wash flex items-center gap-2">
          <Users size={18} className="text-gold" aria-hidden="true" />
          <h2 className="font-display font-semibold tracking-tight text-foreground text-base sm:text-lg">User Management</h2>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <PageLoader label="Loading users" className="min-h-[200px] p-12" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="pl-5">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="pr-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.email} className="border-border/70 hover:bg-accent/35 transition-colors">
                      <TableCell className="pl-5 font-semibold text-foreground text-xs sm:text-sm truncate">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs sm:text-sm truncate">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground text-xs sm:text-sm truncate">{user.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <StatusBadge status={user.role} label={user.role.replace(/_/g, ' ').toLowerCase()} />
                      </TableCell>
                      <TableCell className="pr-5">
                        <div className="flex justify-end gap-1.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                className="border-border text-muted-foreground hover:text-primary hover:bg-primary/10 bg-transparent rounded-lg cursor-pointer"
                                aria-label={`Edit ${user.first_name} ${user.last_name}`}
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit size={15} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit user</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                className="border-border text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent rounded-lg cursor-pointer"
                                aria-label={`Delete ${user.first_name} ${user.last_name}`}
                                onClick={() => handleDeleteUser(user.id || user.email)}
                              >
                                <Trash2 size={15} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete user</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="p-0">
                      <EmptyState
                        title="No users found"
                        description="Add a team member to give them access to the admin panel."
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false)
          setEditingUser(null)
        }}
        onSaved={fetchUsers}
        user={editingUser}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertModalHeader
            icon={Trash2}
            tone="destructive"
            title="Delete this user account?"
            description="This action cannot be undone. The user will permanently lose access to the admin panel."
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Alert Dialog */}
      <AlertDialog open={errorAlertOpen} onOpenChange={setErrorAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Error</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorAlertOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
