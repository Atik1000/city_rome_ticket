'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  } from "@/components/ui/alert-dialog"
import { Plus, Loader2, Edit, Trash2, CheckCircle2, AlertCircle, Save, Megaphone } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { MotionTableRow, staggerIn } from '@/components/motion'
import { NoticeFormModal } from '@/components/dashboard/notice-form-modal'
import { PageHeader } from '@/components/dashboard/page-header'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { EmptyState } from '@/components/dashboard/empty-state'
import { ModalHeader, AlertModalHeader } from '@/components/dashboard/modal-header'
import { getNotices, getNoticeDetail, deleteNotice, updateNotice, Notice } from '@/app/lib/api'
import { getCookie } from '@/app/lib/cookies'

export default function NoticesPage() {
  const reduceMotion = useReducedMotion()
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeNoticeId, setActiveNoticeId] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Create State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [editFormData, setEditFormData] = useState({ title: '', description: '' })

  // Delete State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null)

  // Alert State
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  })

  const fetchNotices = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = getCookie('access_token')
      if (token) {
        const response = await getNotices(token)
        setNotices(response.results)

        // Auto-select active notice or first notice if none active
        const active = response.results.find(n => n.is_active)
        if (active) {
          setActiveNoticeId(active.id)
        } else if (response.results.length > 0) {
          setActiveNoticeId(response.results[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to fetch notices:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotices()
  }, [fetchNotices])

  const activeNotice = notices.find((n) => n.is_active)

  const handleActivateNotice = async (noticeId: number) => {
    try {
      setIsProcessing(true)
      const token = getCookie('access_token')
      if (!token) throw new Error('Auth token not found')

      await updateNotice(token, noticeId.toString(), { is_active: true })

      setAlertConfig({
        show: true,
        title: 'Success',
        message: 'Notice activated successfully.',
        type: 'success'
      })

      fetchNotices()
    } catch (err) {
      console.error('Activation error:', err)
      setAlertConfig({
        show: true,
        title: 'Error',
        message: 'Failed to activate notice.',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteNotice = async () => {
    if (!noticeToDelete) return
    try {
      setIsProcessing(true)
      const token = getCookie('access_token')
      if (!token) throw new Error('Auth token not found')

      await deleteNotice(token, noticeToDelete.id.toString())

      setAlertConfig({
        show: true,
        title: 'Success',
        message: 'Notice deleted successfully.',
        type: 'success'
      })

      if (activeNoticeId === noticeToDelete.id) {
        setActiveNoticeId(null)
      }
      fetchNotices()
    } catch (err) {
      console.error('Deletion error:', err)
      setAlertConfig({
        show: true,
        title: 'Error',
        message: 'Failed to delete notice.',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
      setIsDeleteDialogOpen(false)
      setNoticeToDelete(null)
    }
  }

  const handleOpenEdit = async (notice: Notice) => {
    try {
      setIsProcessing(true)
      const token = getCookie('access_token')
      if (!token) throw new Error('Auth token not found')

      const detail = await getNoticeDetail(token, notice.id.toString())
      setEditingNotice(detail)
      setEditFormData({ title: detail.title, description: detail.description })
      setIsEditModalOpen(true)
    } catch (err) {
      console.error('Failed to fetch notice detail:', err)
      setAlertConfig({
        show: true,
        title: 'Error',
        message: 'Failed to fetch latest notice details.',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpdateNotice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingNotice) return

    try {
      setIsProcessing(true)
      const token = getCookie('access_token')
      if (!token) throw new Error('Auth token not found')

      await updateNotice(token, editingNotice.id.toString(), editFormData)

      setAlertConfig({
        show: true,
        title: 'Success',
        message: 'Notice updated successfully.',
        type: 'success'
      })

      setIsEditModalOpen(false)
      fetchNotices()
    } catch (err: any) {
      console.error('Update error:', err)
      let errorMessage = 'Failed to update notice.'
      if (err) {
        errorMessage = Object.entries(err).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n') || errorMessage
      }
      setAlertConfig({
        show: true,
        title: 'Error',
        message: errorMessage,
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Page Header */}
      <PageHeader
        eyebrow="Announcements"
        title="Notices"
        description="Manage important announcements and system notices"
        actions={
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 whitespace-nowrap text-sm sm:text-base px-4 py-2 h-10 sm:h-11 rounded-lg cursor-pointer transition-all active:scale-95 shadow-lg shadow-primary/15"
          >
            <Plus size={20} />
            Create Notice
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notices List - Left Column */}
        <Card className="lg:col-span-1 border-border/80 overflow-hidden shadow-warm flex flex-col h-fit p-0 gap-0">
          <div className="p-4 sm:p-5 border-b border-border/70 bg-warm-wash flex items-center justify-between">
            <h2 className="font-display font-semibold tracking-tight text-foreground text-base sm:text-lg flex items-center gap-2">
              <Megaphone size={18} className="text-gold" />
              All Notices
            </h2>
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 rounded-full">
              {notices.length} Total
            </Badge>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-12 flex justify-center items-center">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
                    <TableHead className="pl-4">Title</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notices.map((notice, i) => (
                    <MotionTableRow
                      key={notice.id}
                      {...staggerIn(i, reduceMotion)}
                      onClick={() => setActiveNoticeId(notice.id)}
                      className={`border-border/70 hover:bg-accent/35 transition-colors cursor-pointer group ${notice.id === activeNoticeId ? 'bg-primary/5 border-l-4 border-l-gold' : ''
                        }`}
                    >
                      <TableCell className="pl-4 text-xs sm:text-sm font-medium text-foreground py-4">
                        <div className="flex flex-col gap-1">
                          <span className="truncate max-w-[150px]">{notice.title}</span>
                          {notice.id === activeNoticeId && <span className="text-[10px] text-gold font-semibold uppercase tracking-[0.14em]">Viewing</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            disabled={isProcessing || notice.is_active}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleActivateNotice(notice.id)
                            }}
                            className={`cursor-pointer text-xs h-7 px-3 rounded shadow-sm transition-all ${notice.is_active
                              ? 'bg-primary text-primary-foreground opacity-100'
                              : 'bg-transparent border border-primary/30 text-primary hover:bg-primary hover:text-white'
                              }`}
                          >
                            {notice.is_active ? 'Active' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            disabled={isProcessing}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenEdit(notice)
                            }}
                            variant="outline"
                            className="cursor-pointer text-xs h-7 px-3 rounded-md border-border text-foreground hover:bg-primary/10 hover:text-primary bg-transparent flex items-center gap-1 font-semibold"
                          >
                            <Edit size={14} />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </MotionTableRow>
                  ))}
                  {notices.length === 0 && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={2} className="p-0">
                        <EmptyState
                          title="No notices yet"
                          description="Create a notice to broadcast an announcement."
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>

        {/* Active Notice Display - Right Column */}
        <div className="lg:col-span-2">
          {activeNotice ? (
            <Card className="border-border/80 overflow-hidden h-full shadow-warm flex flex-col relative p-0 gap-0">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-gold/70 to-transparent"
                aria-hidden="true"
              />
              <div className="p-6 border-b border-border/70 bg-warm-wash">
                <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">{activeNotice.title}</h2>
                      {activeNotice.is_active && (
                        <StatusBadge status="active" label="Live now" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />
                      System Announcement ID: #{activeNotice.id}
                    </div>
                  </div>
                  <StatusBadge
                    status={activeNotice.is_active ? 'active' : 'inactive'}
                    tone={activeNotice.is_active ? 'success' : 'neutral'}
                  />
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
                <div className="bg-secondary/25 p-6 rounded-xl border border-border/60 min-h-[250px]">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                    {activeNotice.description}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-border/70 bg-secondary/30 flex gap-3 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => handleOpenEdit(activeNotice)}
                  className="flex-1 border-border text-foreground hover:bg-primary/10 hover:text-primary bg-card text-sm h-11 rounded-lg font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Edit size={18} />
                  Edit Notice
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNoticeToDelete(activeNotice)
                    setIsDeleteDialogOpen(true)
                  }}
                  className="flex-1 border-destructive/25 text-destructive hover:text-destructive hover:bg-destructive/10 bg-card text-sm h-11 rounded-lg font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Trash2 size={18} />
                  Delete Notice
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="border-border/80 p-0 flex items-center justify-center h-full shadow-warm-sm bg-card border-dashed min-h-[500px]">
              <EmptyState
                title="No notice selected"
                description="Select a notice from the left panel to view details, edit or manage its status."
                action={
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm h-11 px-8 rounded-lg font-semibold shadow-lg shadow-primary/15 cursor-pointer"
                  >
                    Create New Announcement
                  </Button>
                }
              />
            </Card>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <NoticeFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSaved={fetchNotices}
      />

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <div className="bg-warm-wash p-6 border-b border-border/70">
            <ModalHeader
              icon={Edit}
              title="Update Notice"
              description="Revise the announcement before republishing it"
            />
          </div>
          <form onSubmit={handleUpdateNotice} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-foreground font-semibold">Notice Title</Label>
                <Input
                  id="edit-title"
                  placeholder="The headline of your notice"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="h-11 border-border bg-background/60"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-desc" className="text-foreground font-semibold">Content Description</Label>
                <Textarea
                  id="edit-desc"
                  placeholder="Describe the announcement in detail..."
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="min-h-[250px] border-border bg-background/60 leading-relaxed text-base"
                  required
                />
              </div>
            </div>
            <div className="gold-hairline" aria-hidden="true" />
            <DialogFooter className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="h-11 px-6 border-border font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/15"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Update Notice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md border-destructive/20">
          <AlertModalHeader
            icon={Trash2}
            tone="destructive"
            title={`Delete notice "${noticeToDelete?.title}"?`}
            description="This permanently removes the announcement from the system and cannot be undone."
          />
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="cursor-pointer border-border h-10 px-5 rounded-lg font-semibold transition-all">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNotice}
              disabled={isProcessing}
              className="cursor-pointer bg-destructive hover:bg-destructive/90 text-white border-0 h-10 px-6 rounded-lg font-semibold shadow-lg shadow-destructive/15 transition-all active:scale-95"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'Delete Notice'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog Feedback */}
      <AlertDialog
        open={alertConfig.show}
        onOpenChange={(v) => setAlertConfig({ ...alertConfig, show: v })}
      >
        <AlertDialogContent className="max-w-md">
          <AlertModalHeader
            icon={alertConfig.type === 'success' ? CheckCircle2 : AlertCircle}
            tone={alertConfig.type === 'success' ? 'success' : 'destructive'}
            title={alertConfig.title}
            description={alertConfig.message}
          />
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setAlertConfig({ ...alertConfig, show: false })}
              className={`cursor-pointer ${alertConfig.type === 'success' ? 'bg-primary hover:bg-primary/90 shadow-primary/15' : 'bg-destructive hover:bg-destructive/90 shadow-destructive/15'} text-white border-0 px-8 h-10 rounded-lg font-semibold shadow-lg transition-all active:scale-95`}
            >
              Dismiss
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
