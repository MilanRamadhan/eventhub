'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminGetEvent, adminUpdateEvent, getCategories } from '@/lib/api'
import type { Category } from '@/lib/api'

export default function EditEventPage() {
  const { id } = useParams()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [organizer, setOrganizer] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('upcoming')
  const [isFeatured, setIsFeatured] = useState(false)
  const [maxParticipants, setMaxParticipants] = useState('')
  const [banner, setBanner] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [currentBannerUrl, setCurrentBannerUrl] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [cats, event] = await Promise.all([getCategories(), adminGetEvent(Number(id))])
        setCategories(cats)
        setTitle(event.title)
        setDescription(event.description)
        setLocation(event.location)
        setOrganizer(event.organizer)
        setCategoryId(event.category ? String(event.category) : '')
        setStatus(event.status)
        setIsFeatured(event.is_featured)
        setMaxParticipants(event.max_participants ? String(event.max_participants) : '')
        if (event.banner_url) setCurrentBannerUrl(event.banner_url)
        // Format date for datetime-local input
        if (event.date) {
          const d = new Date(event.date)
          const pad = (n: number) => String(n).padStart(2, '0')
          setDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`)
        }
      } catch {
        toast.error('Gagal memuat data event.')
      } finally {
        setInitialLoading(false)
      }
    }
    if (id) load()
  }, [id])

  const handleFileChange = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 5 MB.')
      return
    }
    setBanner(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileChange(e.dataTransfer.files[0] || null)
  }

  const activePreview = previewUrl || currentBannerUrl

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !date || !location || !organizer) {
      toast.error('Harap isi semua kolom wajib.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('date', date)
    formData.append('location', location)
    formData.append('organizer', organizer)
    if (categoryId) formData.append('category', categoryId)
    else formData.append('category', '')
    formData.append('status', status)
    formData.append('is_featured', isFeatured ? 'true' : 'false')
    if (maxParticipants) formData.append('max_participants', maxParticipants)
    if (banner) formData.append('banner', banner)

    setLoading(true)
    try {
      await adminUpdateEvent(Number(id), formData)
      toast.success('Event berhasil diperbarui!')
      router.push('/admin/events')
    } catch {
      toast.error('Gagal memperbarui event.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 text-slate-200 placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5"

  if (initialLoading) {
    return (
      <div className="p-8 max-w-3xl animate-pulse space-y-4">
        <div className="h-10 bg-[#111118] rounded-xl w-1/3" />
        <div className="h-52 bg-[#111118] rounded-xl" />
        <div className="h-12 bg-[#111118] rounded-xl" />
        <div className="h-28 bg-[#111118] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/events"
          className="p-2 bg-[#111118] border border-[#1e1e2e] hover:border-indigo-500/50 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-syne font-bold text-3xl text-white">Edit Event</h1>
          <p className="text-slate-400 text-sm mt-0.5">Perbarui informasi event.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner */}
        <div>
          <label className={labelClass}>Banner Event</label>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-[#1e1e2e] hover:border-indigo-500/60 rounded-xl cursor-pointer transition-colors overflow-hidden"
          >
            {activePreview ? (
              <div className="relative">
                <img src={activePreview} alt="Preview" className="w-full h-52 object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setBanner(null)
                    setPreviewUrl('')
                    setCurrentBannerUrl('')
                  }}
                  className="absolute top-3 right-3 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors z-10"
                >
                  <X size={14} />
                </button>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">Klik untuk ganti gambar</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
                <div className="p-4 bg-[#1e1e2e] rounded-xl">
                  <Upload size={24} className="text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-400">Klik atau drag gambar ke sini</p>
                  <p className="text-xs mt-1">PNG, JPG, WEBP — maksimal 5 MB</p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label className={labelClass}>Judul Event <span className="text-red-400">*</span></label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul event" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Deskripsi <span className="text-red-400">*</span></label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className={`${inputClass} resize-none`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tanggal &amp; Waktu <span className="text-red-400">*</span></label>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Lokasi <span className="text-red-400">*</span></label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Penyelenggara <span className="text-red-400">*</span></label>
            <input type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Kategori</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
              <option value="">Tanpa kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Berlangsung</option>
              <option value="done">Selesai</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Maks. Peserta</label>
            <input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} placeholder="Tidak terbatas" min={1} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#0d0d14] border border-[#1e1e2e] rounded-xl">
          <div>
            <p className="text-sm font-medium text-slate-300">Tampilkan sebagai Unggulan</p>
            <p className="text-xs text-slate-500 mt-0.5">Event akan muncul di halaman utama.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsFeatured(!isFeatured)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isFeatured ? 'bg-indigo-600' : 'bg-[#1e1e2e]'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isFeatured ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </span>
            ) : (
              'Simpan Perubahan'
            )}
          </button>
          <Link href="/admin/events" className="px-6 py-3 border border-[#1e1e2e] hover:border-slate-600 text-slate-400 hover:text-white font-semibold rounded-xl transition-colors">
            Batal
          </Link>
        </div>
      </form>
    </div>
  )
}
