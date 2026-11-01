'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, CheckCircle2, AlertCircle, Megaphone } from 'lucide-react'
import { ModalHeader, AlertModalHeader } from '@/components/dashboard/modal-header'
import { createNotice } from '@/app/lib/api'
import { getCookie } from '@/app/lib/cookies'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    } from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    } from "@/components/ui/alert-dialog"

interface NoticeFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaved?: () => void
}

export function NoticeFormModal({ open, onOpenChange, onSaved }: NoticeFormModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    })

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

    // Reset the form each time the modal opens
    useEffect(() => {
        if (open) {
            setFormData({ title: '', description: '' })
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const token = getCookie('access_token')
            if (!token) throw new Error('Authentication token not found.')

            await createNotice(token, formData)

            setAlertConfig({
                show: true,
                title: 'Success',
                message: 'Notice created successfully.',
                type: 'success'
            })
        } catch (err: any) {
            console.error('Create notice error:', err)
            let errorMessage = 'Failed to create notice. Please try again.'

            if (err) {
                // Handle validation errors from API
                const errorDetails = Object.entries(err).map(([key, value]) => {
                    if (Array.isArray(value)) return `${key}: ${value.join(', ')}`
                    return `${key}: ${value}`
                }).join('\n')
                errorMessage = errorDetails || errorMessage
            }

            setAlertConfig({
                show: true,
                title: 'Error',
                message: errorMessage,
                type: 'error'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden">
                    <div className="bg-warm-wash p-6 border-b border-border/70">
                        <ModalHeader
                            icon={Megaphone}
                            title="Create New Notice"
                            description="Publish a new announcement for the system"
                        />
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="notice-title" className="text-foreground font-semibold">Title</Label>
                                <Input
                                    id="notice-title"
                                    placeholder="Enter notice title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="h-11 border-border bg-background/60"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notice-description" className="text-foreground font-semibold">Description</Label>
                                <Textarea
                                    id="notice-description"
                                    placeholder="Enter notice description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                onClick={() => onOpenChange(false)}
                                className="h-11 px-6 border-border font-semibold rounded-lg cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/15"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Create Notice
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog */}
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
                            onClick={() => {
                                setAlertConfig({ ...alertConfig, show: false })
                                if (alertConfig.type === 'success') {
                                    onOpenChange(false)
                                    onSaved?.()
                                }
                            }}
                            className={`cursor-pointer ${alertConfig.type === 'success' ? 'bg-primary hover:bg-primary/90' : 'bg-destructive hover:bg-destructive/90'} text-white border-0 px-8`}
                        >
                            {alertConfig.type === 'success' ? 'Continue' : 'Okay'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
