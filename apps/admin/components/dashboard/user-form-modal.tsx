'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'
import { createAuthUser, getAuthUserDetail, updateAuthUser, AuthUser } from '@/app/lib/api'
import { useAuth } from '@/app/contexts/auth-context'

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
  user?: AuthUser | null // present = edit mode
}

const emptyForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  role: '',
}

export function UserFormModal({ isOpen, onClose, onSaved, user }: UserFormModalProps) {
  const { token } = useAuth()
  const isEdit = !!user
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [initialData, setInitialData] = useState<AuthUser | null>(null)
  const [formData, setFormData] = useState(emptyForm)

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean
    title: string
    description: string
    type: 'success' | 'error'
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'success',
  })

  useEffect(() => {
    if (!isOpen) return
    if (user?.id && token) {
      const fetchUser = async () => {
        try {
          setLoading(true)
          const detail = await getAuthUserDetail(token, user.id!.toString())
          setInitialData(detail)
          setFormData({
            first_name: detail.first_name,
            last_name: detail.last_name,
            email: detail.email,
            phone: detail.phone || '',
            password: '', // Password usually shouldn't be populated for security
            role: detail.role,
          })
        } catch (error) {
          console.error('Error fetching user detail:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchUser()
    } else {
      setInitialData(null)
      setFormData(emptyForm)
    }
  }, [isOpen, user, token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const buildErrorMessage = (error: any, fallback: string) => {
    let errorMessage = fallback
    if (typeof error === 'object' && error !== null) {
      // Handle specific field errors from API structure provided
      const errorDetails = Object.entries(error)
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return `${field}: ${messages.join(', ')}`
          }
          return null
        })
        .filter(Boolean)
        .join('\n')

      if (errorDetails) {
        errorMessage = errorDetails
      } else if (error.detail) {
        errorMessage = error.detail
      }
    }
    return errorMessage
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setSaving(true)
    try {
      if (isEdit) {
        if (!user?.id || !initialData) return

        // Create patch data containing only changed fields
        const patchData: any = {}
        if (formData.first_name !== initialData.first_name) patchData.first_name = formData.first_name
        if (formData.last_name !== initialData.last_name) patchData.last_name = formData.last_name
        if (formData.email !== initialData.email) patchData.email = formData.email
        if (formData.phone !== (initialData.phone || '')) patchData.phone = formData.phone
        if (formData.password) patchData.password = formData.password
        if (formData.role !== initialData.role) patchData.role = formData.role

        if (Object.keys(patchData).length === 0) {
          setSaving(false)
          onClose()
          return
        }

        await updateAuthUser(token, user.id.toString(), patchData)
        setAlertConfig({
          isOpen: true,
          title: 'Success',
          description: 'User has been updated successfully.',
          type: 'success',
        })
      } else {
        await createAuthUser(token, formData as any)
        setAlertConfig({
          isOpen: true,
          title: 'Success',
          description: 'User has been created successfully.',
          type: 'success',
        })
      }
    } catch (error: any) {
      console.error(isEdit ? 'Error updating user:' : 'Error creating user:', error)
      setAlertConfig({
        isOpen: true,
        title: 'Error',
        description: buildErrorMessage(
          error,
          isEdit ? 'An error occurred while updating the user.' : 'An error occurred while creating the user.'
        ),
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAlertClose = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }))
    if (alertConfig.type === 'success') {
      onSaved()
      onClose()
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Update User' : 'Add New User'}
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+8801XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEdit ? 'Password (leave blank to keep current)' : 'Password'}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required={!isEdit}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 border-t border-border pt-6 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-border bg-transparent"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEdit ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEdit ? 'Update User' : 'Add User'
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => !open && handleAlertClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={alertConfig.type === 'error' ? 'text-destructive' : 'text-primary'}>
              {alertConfig.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              {alertConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAlertClose}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
