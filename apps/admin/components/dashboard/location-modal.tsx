'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { X, Edit2, MapPin } from 'lucide-react'
import { ModalHeader } from '@/components/dashboard/modal-header'

interface Location {
  id: string
  name: string
  description: string
}

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (locations: Location[]) => void
  initialLocations: Location[]
  mode: 'create' | 'edit'
}

export function LocationModal({
  isOpen,
  onClose,
  onSave,
  initialLocations,
  mode,
}: LocationModalProps) {
  const [locations, setLocations] = useState<Location[]>(initialLocations)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAddLocation = () => {
    if (name.trim()) {
      if (editingId) {
        setLocations(
          locations.map((loc) =>
            loc.id === editingId ? { ...loc, name, description } : loc
          )
        )
        setEditingId(null)
      } else {
        setLocations([
          ...locations,
          { id: Date.now().toString(), name, description },
        ])
      }
      setName('')
      setDescription('')
    }
  }

  const handleRemove = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id))
  }

  const handleEdit = (location: Location) => {
    setName(location.name)
    setDescription(location.description)
    setEditingId(location.id)
  }

  const handleSave = () => {
    onSave(locations)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <ModalHeader
          icon={MapPin}
          title={mode === 'create' ? 'Add New Location' : 'Edit Locations'}
          description="Curate the stops this tour visits"
        />

        <div className="space-y-6">
          {/* Location List */}
          {locations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Current Locations</h3>
              <div className="space-y-2 mb-4">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between bg-secondary/40 p-3 rounded-lg border border-border/70"
                  >
                    <div className="flex-1 flex items-start gap-2.5 min-w-0">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{location.name}</p>
                        {location.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {location.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(location)}
                        aria-label={`Edit location ${location.name}`}
                        className="text-primary hover:bg-primary/10 p-2 rounded cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleRemove(location.id)}
                        aria-label={`Remove location ${location.name}`}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add/Edit Location Form */}
          <div className="gold-hairline" aria-hidden="true" />
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              {editingId ? 'Edit Location' : 'Add New Location'}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="location-name" className="text-foreground">
                Location Name
              </Label>
              <Input
                id="location-name"
                placeholder="e.g., Colosseum"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-desc" className="text-foreground">
                Description
              </Label>
              <Input
                id="location-desc"
                placeholder="Brief description of the location"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-border"
              />
            </div>

            {/* <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAddLocation}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {editingId ? 'Update Location' : 'Add Location'}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setName('')
                    setDescription('')
                  }}
                  className="border-border"
                >
                  Cancel
                </Button>
              )}
            </div> */}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 border-t border-border/70 pt-5">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-border bg-transparent cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-lg shadow-primary/15"
          >
            {editingId ? 'Update Location' : 'Add Location'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
