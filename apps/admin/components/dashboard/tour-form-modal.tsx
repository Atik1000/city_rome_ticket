'use client'

import { useState, useEffect } from 'react'
import {
    Plus,
    Save,
    Trash2,
    Info,
    CheckCircle2,
    XSquare,
    Loader2,
    AlertCircle,
    ImagePlus,
    X,
    MapPin,
    Edit2,
    Landmark
} from 'lucide-react'
import { ModalHeader, AlertModalHeader } from '@/components/dashboard/modal-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { createTourPlan, updateTourPlan, uploadTourImage, deleteTourImage, TourImage, TourLocation, TourPlan, createTourLocation, updateTourLocation, deleteTourLocation } from '@/app/lib/api'
import { getCookie } from '@/app/lib/cookies'

interface TourFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tour?: TourPlan | null
    onSaved?: () => void
}

const initialFormState = {
    title: '',
    description: '',
    full_description: '',
    price_adult: '',
    adult_age_min: '' as any,
    adult_age_max: '' as any,
    price_child: '',
    child_age_min: '' as any,
    child_age_max: '' as any,
    price_infant: '',
    infant_age_min: '' as any,
    infant_age_max: '' as any,
    price_youth: '',
    youth_age_min: '' as any,
    youth_age_max: '' as any,
    price_student_eu: '',
    student_eu_age_min: '' as any,
    student_eu_age_max: '' as any,
    free_cancellation: true,
    pickup_included: false,
    duration_days: '' as any,
    is_active: true,
}

export function TourFormModal({ open, onOpenChange, tour, onSaved }: TourFormModalProps) {
    const isEditMode = !!tour

    const [isSaving, setIsSaving] = useState(false)
    const [errorDialog, setErrorDialog] = useState<{ isOpen: boolean; title: string; message: string }>({
        isOpen: false,
        title: '',
        message: ''
    })
    const [successDialogOpen, setSuccessDialogOpen] = useState(false)

    // Image Upload State
    const [uploadedImages, setUploadedImages] = useState<TourImage[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [deletingImageId, setDeletingImageId] = useState<number | null>(null)

    // Location State
    const [uploadedLocations, setUploadedLocations] = useState<TourLocation[]>([])
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
    const [isProcessingLocation, setIsProcessingLocation] = useState(false)
    const [deletingLocationId, setDeletingLocationId] = useState<number | null>(null)
    const [editingLocation, setEditingLocation] = useState<TourLocation | null>(null)
    const [locationForm, setLocationForm] = useState({ name: '', description: '' })

    // Form State
    const [formData, setFormData] = useState({ ...initialFormState })

    // Array states
    const [highlights, setHighlights] = useState<string[]>([])
    const [includes, setIncludes] = useState<string[]>([])
    const [excludes, setExcludes] = useState<string[]>([])
    const [notSuitableFor, setNotSuitableFor] = useState<string[]>([])
    const [notAllowed, setNotAllowed] = useState<string[]>([])
    const [knowBeforeYouGo, setKnowBeforeYouGo] = useState<string[]>([])

    // Populate (edit) or reset (create) the form each time the modal opens.
    // In create mode, pending images/locations are restored from local storage.
    useEffect(() => {
        if (!open) return

        if (tour) {
            setFormData({
                title: tour.title || '',
                description: tour.description || '',
                full_description: tour.full_description || '',
                price_adult: tour.price_adult || '',
                adult_age_min: tour.adult_age_min ?? '',
                adult_age_max: tour.adult_age_max ?? '',
                price_child: tour.price_child || '',
                child_age_min: tour.child_age_min ?? '',
                child_age_max: tour.child_age_max ?? '',
                price_infant: tour.price_infant || '',
                infant_age_min: tour.infant_age_min ?? '',
                infant_age_max: tour.infant_age_max ?? '',
                price_youth: tour.price_youth || '',
                youth_age_min: tour.youth_age_min ?? '',
                youth_age_max: tour.youth_age_max ?? '',
                price_student_eu: tour.price_student_eu || '',
                student_eu_age_min: tour.student_eu_age_min ?? '',
                student_eu_age_max: tour.student_eu_age_max ?? '',
                free_cancellation: tour.free_cancellation ?? true,
                pickup_included: tour.pickup_included ?? false,
                duration_days: tour.duration_days ?? '',
                is_active: tour.is_active ?? true,
            })
            setHighlights(tour.highlights || [])
            setIncludes(tour.includes || [])
            setExcludes(tour.excludes || [])
            setNotSuitableFor(tour.not_suitable_for || [])
            setNotAllowed(tour.not_allowed || [])
            setKnowBeforeYouGo(tour.know_before_you_go || [])
            setUploadedImages(tour.images || [])
            setUploadedLocations(tour.locations || [])
        } else {
            setFormData({ ...initialFormState })
            setHighlights([])
            setIncludes([])
            setExcludes([])
            setNotSuitableFor([])
            setNotAllowed([])
            setKnowBeforeYouGo([])

            const savedImages = localStorage.getItem('tour_uploaded_images')
            if (savedImages) {
                try {
                    setUploadedImages(JSON.parse(savedImages))
                } catch (e) {
                    console.error("Failed to parse saved images", e)
                    setUploadedImages([])
                }
            } else {
                setUploadedImages([])
            }

            const savedLocations = localStorage.getItem('tour_uploaded_locations')
            if (savedLocations) {
                try {
                    setUploadedLocations(JSON.parse(savedLocations))
                } catch (e) {
                    console.error("Failed to parse saved locations", e)
                    setUploadedLocations([])
                }
            } else {
                setUploadedLocations([])
            }
        }
    }, [open, tour])

    const updateLocalStorage = (images: TourImage[]) => {
        if (isEditMode) return
        localStorage.setItem('tour_uploaded_images', JSON.stringify(images))
    }

    const updateLocationLocalStorage = (locations: TourLocation[]) => {
        if (isEditMode) return
        localStorage.setItem('tour_uploaded_locations', JSON.stringify(locations))
    }

    // Helper for adding to arrays
    const addToArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        if (value.trim()) {
            setter(prev => [...prev, value.trim()])
        }
    }

    // Helper for removing from arrays
    const removeFromArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        setter(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const token = getCookie('access_token')
            if (!token) {
                throw new Error('No authentication token found.')
            }

            const parseNumber = (val: any) => (val === '' || val === null || val === undefined) ? 0 : Number(val)

            const payload = {
                ...formData,
                adult_age_min: parseNumber(formData.adult_age_min),
                adult_age_max: parseNumber(formData.adult_age_max),
                child_age_min: parseNumber(formData.child_age_min),
                child_age_max: parseNumber(formData.child_age_max),
                infant_age_min: parseNumber(formData.infant_age_min),
                infant_age_max: parseNumber(formData.infant_age_max),
                youth_age_min: parseNumber(formData.youth_age_min),
                youth_age_max: parseNumber(formData.youth_age_max),
                student_eu_age_min: parseNumber(formData.student_eu_age_min),
                student_eu_age_max: parseNumber(formData.student_eu_age_max),
                duration_days: parseNumber(formData.duration_days),
                highlights,
                includes,
                excludes,
                not_suitable_for: notSuitableFor,
                not_allowed: notAllowed,
                know_before_you_go: knowBeforeYouGo,
                image_ids: uploadedImages.map(img => img.id),
                location_ids: uploadedLocations.map(loc => loc.id)
            }

            if (tour) {
                await updateTourPlan(token, tour.id.toString(), payload)
            } else {
                await createTourPlan(token, payload)
                localStorage.removeItem('tour_uploaded_images')
                localStorage.removeItem('tour_uploaded_locations')
            }
            setSuccessDialogOpen(true)
        } catch (err: any) {
            console.error(isEditMode ? 'Update tour error:' : 'Create tour error:', err)
            let message = 'An unexpected error occurred. Please try again.'

            if (err.detail) {
                message = Array.isArray(err.detail) ? err.detail.join('\n') : err.detail
            } else if (typeof err === 'object') {
                const errorDetails = Object.entries(err)
                    .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                    .join('\n')
                message = errorDetails || message
            }

            setErrorDialog({
                isOpen: true,
                title: isEditMode ? 'Error Updating Tour' : 'Error Creating Tour',
                message
            })
        } finally {
            setIsSaving(false)
        }
    }

    const ArrayField = ({
        label,
        items,
        setter,
        placeholder,
        icon: Icon
    }: {
        label: string;
        items: string[];
        setter: React.Dispatch<React.SetStateAction<string[]>>;
        placeholder: string;
        icon: any;
    }) => {
        const [tempValue, setTempValue] = useState('')
        return (
            <Card className="p-4 border-border bg-card shadow-warm-sm space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold">
                    <Icon size={18} />
                    <Label className="text-foreground">{label}</Label>
                </div>
                <div className="flex gap-2">
                    <Input
                        value={tempValue}
                        onChange={e => setTempValue(e.target.value)}
                        placeholder={placeholder}
                        className="border-border focus:ring-primary"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                addToArray(setter, tempValue)
                                setTempValue('')
                            }
                        }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            addToArray(setter, tempValue)
                            setTempValue('')
                        }}
                        className="border-border hover:bg-primary/10 cursor-pointer"
                    >
                        <Plus size={18} />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {items.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="flex items-center gap-1 py-1 px-3">
                            {item}
                            <button type="button" onClick={() => removeFromArray(setter, idx)} className="hover:text-destructive">
                                <Trash2 size={12} />
                            </button>
                        </Badge>
                    ))}
                </div>
            </Card>
        )
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const token = getCookie('access_token')
        if (!token) {
            setErrorDialog({
                isOpen: true,
                title: 'Authentication Error',
                message: 'No authentication token found. Please log in again.'
            })
            return
        }

        setIsUploading(true)
        const newUploadedImages = [...uploadedImages]

        try {
            for (let i = 0; i < files.length; i++) {
                const img = await uploadTourImage(token, files[i])
                newUploadedImages.push(img)
            }
            setUploadedImages(newUploadedImages)
            updateLocalStorage(newUploadedImages)
        } catch (err: any) {
            setErrorDialog({
                isOpen: true,
                title: 'Upload Error',
                message: err.detail || 'Failed to upload one or more images.'
            })
        } finally {
            setIsUploading(false)
            // Clear input
            e.target.value = ''
        }
    }

    const handleImageDelete = async (id: number) => {
        const token = getCookie('access_token')
        if (!token) return

        setDeletingImageId(id)
        try {
            await deleteTourImage(token, id)
            const filteredImages = uploadedImages.filter(img => img.id !== id)
            setUploadedImages(filteredImages)
            updateLocalStorage(filteredImages)
        } catch (err: any) {
            setErrorDialog({
                isOpen: true,
                title: 'Delete Error',
                message: 'Failed to delete image from the server.'
            })
        } finally {
            setDeletingImageId(null)
        }
    }

    const handleLocationSave = async () => {
        if (!locationForm.name.trim()) return

        const token = getCookie('access_token')
        if (!token) return

        setIsProcessingLocation(true)
        try {
            if (editingLocation) {
                const updated = await updateTourLocation(token, editingLocation.id, locationForm)
                const newLocations = uploadedLocations.map(loc => loc.id === updated.id ? updated : loc)
                setUploadedLocations(newLocations)
                updateLocationLocalStorage(newLocations)
            } else {
                const created = await createTourLocation(token, locationForm)
                const newLocations = [...uploadedLocations, created]
                setUploadedLocations(newLocations)
                updateLocationLocalStorage(newLocations)
            }
            setIsLocationModalOpen(false)
            setEditingLocation(null)
            setLocationForm({ name: '', description: '' })
        } catch (err: any) {
            setErrorDialog({
                isOpen: true,
                title: 'Location Error',
                message: err.name ? `Name: ${err.name[0]}` : 'Failed to save location.'
            })
        } finally {
            setIsProcessingLocation(false)
        }
    }

    const handleLocationDelete = async (id: number) => {
        const token = getCookie('access_token')
        if (!token) return

        setDeletingLocationId(id)
        try {
            await deleteTourLocation(token, id)
            const filteredLocations = uploadedLocations.filter(loc => loc.id !== id)
            setUploadedLocations(filteredLocations)
            updateLocationLocalStorage(filteredLocations)
        } catch (err: any) {
            setErrorDialog({
                isOpen: true,
                title: 'Delete Error',
                message: 'Failed to delete location from the server.'
            })
        } finally {
            setDeletingLocationId(null)
        }
    }

    const openEditLocation = (loc: TourLocation) => {
        setEditingLocation(loc)
        setLocationForm({ name: loc.name, description: loc.description })
        setIsLocationModalOpen(true)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-4xl max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden">
                    {/* Sticky Header */}
                    <div className="px-6 py-5 border-b border-border/70 bg-warm-wash">
                        <ModalHeader
                            icon={Landmark}
                            title={isEditMode ? 'Update Tour' : 'Create New Tour'}
                            description={
                                isEditMode
                                    ? 'Modify the details of your tour offering'
                                    : 'Fill in the details to publish a new tour offering'
                            }
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h2 className="font-display text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
                                    <Info className="text-primary" size={18} />
                                    Basic Information
                                </h2>

                                <div className="space-y-2">
                                    <Label htmlFor="tour-title">Tour Title</Label>
                                    <Input
                                        id="tour-title"
                                        required
                                        placeholder="e.g. Rome: Colosseum & Roman Forum Tour"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="border-border text-lg font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tour-description">Short Description</Label>
                                    <Textarea
                                        id="tour-description"
                                        required
                                        placeholder="Provide a brief summary of the tour"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="border-border min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tour-full-description">Full Description</Label>
                                    <Textarea
                                        id="tour-full-description"
                                        placeholder="Describe the tour in detail (historical context, itinerary, etc.)"
                                        value={formData.full_description}
                                        onChange={e => setFormData({ ...formData, full_description: e.target.value })}
                                        className="border-border min-h-[200px]"
                                    />
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="space-y-4 pt-4 border-t border-border">
                                <Label className="text-lg font-bold flex items-center gap-2">
                                    <ImagePlus className="text-primary" size={20} />
                                    Tour Images
                                </Label>
                                <Card className="p-6 border-dashed border-2 border-border bg-card/20 hover:bg-card/30 transition-colors">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="p-4 bg-primary/10 rounded-full">
                                            {isUploading ? <Loader2 className="animate-spin text-primary" size={32} /> : <ImagePlus className="text-primary" size={32} />}
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold">{isUploading ? 'Uploading...' : 'Upload Tour Images'}</p>
                                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (Max 5MB each)</p>
                                        </div>
                                        <Input
                                            id="tour-image-upload"
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                            accept="image/*"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById('tour-image-upload')?.click()}
                                            disabled={isUploading}
                                            className="cursor-pointer border-primary text-primary hover:bg-primary/10"
                                        >
                                            {isUploading ? 'Please wait...' : 'Select Images'}
                                        </Button>
                                    </div>
                                </Card>

                                {/* Image Previews */}
                                {uploadedImages.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                        {uploadedImages.map((img) => (
                                            <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-secondary shadow-sm">
                                                <img
                                                    src={img.file}
                                                    alt="Tour preview"
                                                    className="w-full h-full object-fixed transition-transform group-hover:scale-105"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleImageDelete(img.id)}
                                                    disabled={deletingImageId === img.id}
                                                    className={`cursor-pointer absolute top-2 right-2 p-1.5 bg-destructive/90 text-white rounded-full opacity-100 transition-opacity shadow-lg hover:bg-destructive ${deletingImageId === img.id ? 'cursor-not-allowed' : ''}`}
                                                >
                                                    {deletingImageId === img.id ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <X size={14} />
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Location Section */}
                            <div className="space-y-4 pt-4 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <Label className="text-lg font-bold flex items-center gap-2">
                                        <MapPin className="text-primary" size={20} />
                                        Tour Locations
                                    </Label>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setEditingLocation(null)
                                            setLocationForm({ name: '', description: '' })
                                            setIsLocationModalOpen(true)
                                        }}
                                        className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8"
                                    >
                                        <Plus className="mr-1" size={14} />
                                        Add Location
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {uploadedLocations.length > 0 ? (
                                        uploadedLocations.map((loc) => (
                                            <Card key={loc.id} className="flex items-center justify-between p-3 bg-secondary/50 border-border group">
                                                <div className="flex-1">
                                                    <Badge className="mb-1 bg-primary/20 text-primary hover:bg-primary/30 border-none">{loc.name}</Badge>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{loc.description}</p>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditLocation(loc)}
                                                        className="cursor-pointer h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                                    >
                                                        <Edit2 size={14} />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={deletingLocationId === loc.id}
                                                        onClick={() => handleLocationDelete(loc.id)}
                                                        className="cursor-pointer h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        {deletingLocationId === loc.id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <X size={14} />
                                                        )}
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 border-2 border-dashed border-border rounded-lg bg-card/20 text-muted-foreground text-sm">
                                            No locations added yet. Click "Add Location" to start.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pricing Sections */}
                            <div className="space-y-4 pt-4 border-t border-border">
                                <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">Pricing & Age Groups</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Adults */}
                                    <Card className="p-4 border-primary/20 bg-primary/5 shadow-sm space-y-4">
                                        <h3 className="font-bold text-primary flex items-center justify-between">
                                            Adults
                                            <Badge variant="outline" className="border-primary/30 text-primary">Required</Badge>
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Price ($)</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="e.g. 0.00"
                                                    value={formData.price_adult}
                                                    onChange={e => setFormData({ ...formData, price_adult: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Min Age</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 18"
                                                    value={formData.adult_age_min}
                                                    onChange={e => setFormData({ ...formData, adult_age_min: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Max Age</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 99"
                                                    value={formData.adult_age_max}
                                                    onChange={e => setFormData({ ...formData, adult_age_max: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Children */}
                                    <Card className="p-4 border-border bg-card/50 shadow-sm space-y-4">
                                        <h3 className="font-bold text-foreground">Children</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Price ($)</Label>
                                                <Input type="text"
                                                    placeholder="e.g. 0.00"
                                                    value={formData.price_child}
                                                    onChange={e => setFormData({ ...formData, price_child: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Min Age</Label>
                                                <Input type="number"
                                                    placeholder="e.g. 3"
                                                    value={formData.child_age_min}
                                                    onChange={e => setFormData({ ...formData, child_age_min: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Max Age</Label>
                                                <Input type="number"
                                                    placeholder="e.g. 12"
                                                    value={formData.child_age_max}
                                                    onChange={e => setFormData({ ...formData, child_age_max: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Infants */}
                                    <Card className="p-4 border-border bg-card/50 shadow-sm space-y-4">
                                        <h3 className="font-bold text-foreground">Infants</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Price ($)</Label>
                                                <Input type="text"
                                                    placeholder="e.g. 0.00"
                                                    value={formData.price_infant}
                                                    onChange={e => setFormData({ ...formData, price_infant: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Min Age</Label>
                                                <Input type="number"
                                                    placeholder="e.g. 0"
                                                    value={formData.infant_age_min}
                                                    onChange={e => setFormData({ ...formData, infant_age_min: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Max Age</Label>
                                                <Input type="number"
                                                    placeholder="e.g. 2"
                                                    value={formData.infant_age_max}
                                                    onChange={e => setFormData({ ...formData, infant_age_max: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Youth */}
                                    <Card className="p-4 border-border bg-card/50 shadow-sm space-y-4">
                                        <h3 className="font-bold text-foreground">Youth</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Price ($)</Label>
                                                <Input type="text"
                                                    placeholder="e.g. 0.00"
                                                    value={formData.price_youth}
                                                    onChange={e => setFormData({ ...formData, price_youth: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Min Age</Label>
                                                <Input type="number"
                                                    placeholder="e.g. 13"
                                                    value={formData.youth_age_min}
                                                    onChange={e => setFormData({ ...formData, youth_age_min: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Max Age</Label>
                                                <Input type="number"
                                                    placeholder="e.g. 17"
                                                    value={formData.youth_age_max}
                                                    onChange={e => setFormData({ ...formData, youth_age_max: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                        </div>
                                    </Card>

                                    {/* EU Students */}
                                    <Card className="p-4 border-border bg-card/50 shadow-sm space-y-4">
                                        <h3 className="font-bold text-foreground">Students (EU)</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Price ($)</Label>
                                                <Input type="text"
                                                    placeholder="e.g. 0.00"
                                                    value={formData.price_student_eu}
                                                    onChange={e => setFormData({ ...formData, price_student_eu: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Min Age</Label>
                                                <Input type="number"
                                                    placeholder="e.g. 18"
                                                    value={formData.student_eu_age_min}
                                                    onChange={e => setFormData({ ...formData, student_eu_age_min: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Max Age</Label>
                                                <Input type="number"
                                                    placeholder="e.g. 26"
                                                    value={formData.student_eu_age_max}
                                                    onChange={e => setFormData({ ...formData, student_eu_age_max: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            {/* Tour Status */}
                            <div className="space-y-4 pt-4 border-t border-border">
                                <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">Tour Status</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label>Active Status</Label>
                                            <p className="text-xs text-muted-foreground">Visible on website</p>
                                        </div>
                                        <Switch
                                            checked={formData.is_active}
                                            onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                                            className='cursor-pointer'
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label>Free Cancellation</Label>
                                            <p className="text-xs text-muted-foreground">Allow full refund</p>
                                        </div>
                                        <Switch
                                            checked={formData.free_cancellation}
                                            onCheckedChange={(v) => setFormData({ ...formData, free_cancellation: v })}
                                            className='cursor-pointer'
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label>Pickup Included</Label>
                                            <p className="text-xs text-muted-foreground">Hotel pickup availability</p>
                                        </div>
                                        <Switch
                                            checked={formData.pickup_included}
                                            onCheckedChange={(v) => setFormData({ ...formData, pickup_included: v })}
                                            className='cursor-pointer'
                                        />
                                    </div>

                                    <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                                        <Label>Duration (Days)</Label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 1"
                                            value={formData.duration_days}
                                            onChange={e => setFormData({ ...formData, duration_days: e.target.value })}
                                            className="border-border bg-background"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* List Fields */}
                            <div className="space-y-4 pt-4 border-t border-border">
                                <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">Tour Details & Lists</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ArrayField
                                        label="Highlights"
                                        items={highlights}
                                        setter={setHighlights}
                                        placeholder="e.g. Skip-the-line access"
                                        icon={CheckCircle2}
                                    />
                                    <ArrayField
                                        label="Includes"
                                        items={includes}
                                        setter={setIncludes}
                                        placeholder="e.g. Professional guide"
                                        icon={Plus}
                                    />
                                    <ArrayField
                                        label="Excludes"
                                        items={excludes}
                                        setter={setExcludes}
                                        placeholder="e.g. Gratuities"
                                        icon={Trash2}
                                    />
                                    <ArrayField
                                        label="Know Before You Go"
                                        items={knowBeforeYouGo}
                                        setter={setKnowBeforeYouGo}
                                        placeholder="e.g. Wear comfortable shoes"
                                        icon={Info}
                                    />
                                    <ArrayField
                                        label="Not Suitable For"
                                        items={notSuitableFor}
                                        setter={setNotSuitableFor}
                                        placeholder="e.g. Wheelchair users"
                                        icon={XSquare}
                                    />
                                    <ArrayField
                                        label="Not Allowed"
                                        items={notAllowed}
                                        setter={setNotAllowed}
                                        placeholder="e.g. Large bags"
                                        icon={AlertCircle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <DialogFooter className="px-6 py-4 border-t border-border/70 bg-secondary/30">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="cursor-pointer border-border bg-card hover:bg-secondary px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 px-8 shadow-lg shadow-primary/15"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {isEditMode ? 'Update Tour' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Location Modal */}
            <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
                <DialogContent className="max-w-md border-primary/20">
                    <ModalHeader
                        icon={MapPin}
                        title={editingLocation ? 'Update Location' : 'Add New Location'}
                    />
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="loc-name">Location Name</Label>
                            <Input
                                id="loc-name"
                                placeholder="e.g. History Museum"
                                value={locationForm.name}
                                onChange={e => setLocationForm({ ...locationForm, name: e.target.value })}
                                className="border-border bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="loc-desc">Description</Label>
                            <Textarea
                                id="loc-desc"
                                placeholder="Short details about this location..."
                                value={locationForm.description}
                                onChange={e => setLocationForm({ ...locationForm, description: e.target.value })}
                                className="border-border bg-background min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsLocationModalOpen(false)}
                            className="cursor-pointer border-border hover:bg-secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleLocationSave}
                            disabled={isProcessingLocation || !locationForm.name.trim()}
                            className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]"
                        >
                            {isProcessingLocation ? <Loader2 size={16} className="animate-spin" /> : (editingLocation ? 'Update' : 'Add Location')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Error Dialog */}
            <AlertDialog
                open={errorDialog.isOpen}
                onOpenChange={(v) => setErrorDialog({ ...errorDialog, isOpen: v })}
            >
                <AlertDialogContent className="max-w-md border-destructive/20">
                    <AlertModalHeader
                        icon={AlertCircle}
                        tone="destructive"
                        title={errorDialog.title}
                        description={errorDialog.message}
                    />
                    <AlertDialogFooter>
                        <AlertDialogAction className="cursor-pointer bg-destructive hover:bg-destructive/90 text-white border-0">
                            Okay
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Success Dialog */}
            <AlertDialog
                open={successDialogOpen}
                onOpenChange={setSuccessDialogOpen}
            >
                <AlertDialogContent className="max-w-md border-primary/20">
                    <AlertModalHeader
                        icon={CheckCircle2}
                        tone="success"
                        title="Success!"
                        description={isEditMode
                            ? 'Tour details have been updated successfully.'
                            : 'Your new tour has been created successfully and is now live.'}
                    />
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => {
                                setSuccessDialogOpen(false)
                                onOpenChange(false)
                                onSaved?.()
                            }}
                            className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
