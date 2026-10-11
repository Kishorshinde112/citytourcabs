'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  UploadCloud,
  Image as ImageIcon,
  FolderOpen,
  Trash2,
  ExternalLink,
  Check,
  X,
  Search,
  Loader2,
  Link as LinkIcon,
} from 'lucide-react'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  aspectRatio?: 'video' | 'square' | 'wide'
  helperText?: string
}

interface MediaItem {
  id: number | string
  filename?: string
  alt?: string
  url?: string
  createdAt?: string
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  label = 'Banner / Hero Image',
  aspectRatio = 'video',
  helperText = 'JPG, PNG, WebP up to 10MB recommended.',
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [mediaModalOpen, setMediaModalOpen] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [manualUrl, setManualUrl] = useState(value)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setManualUrl(value)
  }, [value])

  // Fetch Media Library items
  const fetchMediaLibrary = async () => {
    setLoadingMedia(true)
    try {
      const token = localStorage.getItem('payload-token') || localStorage.getItem('adminToken')
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch('/api/media?limit=60&sort=-createdAt', {
        headers,
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        const docs = data.docs || []
        // Normalize URLs
        const normalized = docs.map((doc: any) => ({
          ...doc,
          url: doc.url || (doc.filename ? `/media/${doc.filename}` : ''),
        }))
        setMediaItems(normalized)
      }
    } catch (err) {
      console.error('Failed to load media library:', err)
    } finally {
      setLoadingMedia(false)
    }
  }

  const handleOpenMediaModal = () => {
    setMediaModalOpen(true)
    fetchMediaLibrary()
  }

  // Handle local file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      const token = localStorage.getItem('payload-token') || localStorage.getItem('adminToken')
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const formData = new FormData()
      formData.append('file', file)
      const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      formData.append('_payload', JSON.stringify({ alt: altText }))

      const res = await fetch('/api/media', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData?.errors?.[0]?.message || `Upload failed with status ${res.status}`)
      }

      const data = await res.json()
      const doc = data.doc || {}
      const finalUrl = doc.url || (doc.filename ? `/media/${doc.filename}` : '')

      if (!finalUrl) {
        throw new Error('No URL returned from media upload')
      }

      onChange(finalUrl)
      setManualUrl(finalUrl)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err: any) {
      console.error('Image upload error:', err)
      setUploadError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSelectMediaItem = (item: MediaItem) => {
    if (item.url) {
      onChange(item.url)
      setManualUrl(item.url)
      setMediaModalOpen(false)
    }
  }

  const handleClearImage = () => {
    onChange('')
    setManualUrl('')
  }

  const handleManualUrlSave = () => {
    onChange(manualUrl)
  }

  const filteredMedia = mediaItems.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (item.alt && item.alt.toLowerCase().includes(q)) ||
      (item.filename && item.filename.toLowerCase().includes(q))
    )
  })

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'wide'
        ? 'aspect-21/9'
        : 'aspect-video'

  return (
    <div className="space-y-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Label and Status */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        {uploadSuccess && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 animate-fade-in">
            <Check className="w-3.5 h-3.5" /> Uploaded successfully!
          </span>
        )}
      </div>

      {/* Image Preview Container */}
      <div
        className={`relative ${aspectClass} rounded-xl overflow-hidden bg-slate-100 border-2 border-dashed ${
          value ? 'border-slate-200' : 'border-slate-300 hover:border-yellow-400'
        } transition group`}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-102"
              onError={(e) => {
                // Fallback indicator on load error
                ;(e.currentTarget as HTMLElement).style.opacity = '0.5'
              }}
            />
            {/* Overlay Action Buttons */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                title="Change Image"
              >
                <UploadCloud className="w-3.5 h-3.5 text-slate-700" />
                Change
              </button>
              <button
                type="button"
                onClick={handleOpenMediaModal}
                className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                title="Choose from Media Library"
              >
                <FolderOpen className="w-3.5 h-3.5 text-slate-700" />
                Media
              </button>
              <button
                type="button"
                onClick={handleClearImage}
                className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold shadow-sm transition cursor-pointer"
                title="Remove Image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-slate-50/80 transition"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                <span className="text-xs font-bold text-slate-700">Uploading image...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center text-yellow-600 mb-2">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Click to Upload Image from Computer
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">{helperText}</span>
              </>
            )}
          </div>
        )}

        {/* Uploading Spinner Overlay */}
        {uploading && value && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex flex-col items-center justify-center gap-2 z-10">
            <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
            <span className="text-xs font-bold text-slate-700">Uploading...</span>
          </div>
        )}
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>{uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)} className="cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <UploadCloud className="w-3.5 h-3.5 text-yellow-400" />
          <span>Upload Image</span>
        </button>

        <button
          type="button"
          onClick={handleOpenMediaModal}
          className="py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>Media Library</span>
        </button>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className={`p-2 rounded-lg border text-xs transition cursor-pointer ${
            showUrlInput
              ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
              : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-600'
          }`}
          title="Direct URL input"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Optional Direct URL Input */}
      {showUrlInput && (
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 animate-fade-in">
          <label className="block text-[11px] font-bold text-slate-600">
            Image URL / Path
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="/media/image.jpg or https://..."
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:border-yellow-400 outline-none font-mono"
            />
            <button
              type="button"
              onClick={handleManualUrlSave}
              className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────
          MEDIA LIBRARY MODAL
      ─────────────────────────────────────────────────────────── */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-2xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Select from Media Library</h3>
                <p className="text-xs text-slate-500">
                  Click any image to choose it for this section.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Upload toolbar */}
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search media by name or alt text..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-yellow-400"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click()
                  setMediaModalOpen(false)
                }}
                className="px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {loadingMedia ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                  <span className="text-xs font-semibold">Loading media files...</span>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">No media items found</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Upload an image or check your search query.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredMedia.map((item) => {
                    const isSelected = value === item.url
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectMediaItem(item)}
                        className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                          isSelected
                            ? 'border-yellow-500 ring-2 ring-yellow-400/30'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div className="aspect-video bg-slate-100 overflow-hidden">
                          {item.url ? (
                            <img
                              src={item.url}
                              alt={item.alt || ''}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white border-t border-slate-100">
                          <p
                            className="text-[11px] font-bold text-slate-800 truncate"
                            title={item.alt || item.filename || 'Image'}
                          >
                            {item.alt || item.filename || 'Untitled'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">
                            {item.filename || ''}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-xs">
                            ✓
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>{filteredMedia.length} media file(s) available</span>
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
