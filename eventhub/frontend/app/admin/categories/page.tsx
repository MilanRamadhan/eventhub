'use client'
import { useEffect, useState, FormEvent } from 'react'
import { PlusCircle, Pencil, Trash2, X, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '@/lib/api'
import type { Category } from '@/lib/api'

const PRESET_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ec4899',
  '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6',
]

function CategoryModal({
  category,
  onClose,
  onSave,
}: {
  category: Category | null
  onClose: () => void
  onSave: (data: { name: string; color: string }) => Promise<void>
}) {
  const [name, setName] = useState(category?.name || '')
  const [color, setColor] = useState(category?.color || '#6366f1')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Nama kategori wajib diisi.'); return }
    setLoading(true)
    try {
      await onSave({ name: name.trim(), color })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne font-bold text-lg text-white">
            {category ? 'Edit Kategori' : 'Tambah Kategori'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Nama Kategori</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Seminar"
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 text-slate-200 placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Warna</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-lg border-2 transition-all"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? 'white' : 'transparent',
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] cursor-pointer"
              />
              <span className="text-slate-400 text-sm font-mono">{color}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              {loading ? 'Menyimpan...' : (category ? 'Simpan' : 'Tambah')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#1e1e2e] hover:border-slate-600 text-slate-400 hover:text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const loadCategories = () => {
    setLoading(true)
    adminGetCategories()
      .then(setCategories)
      .catch(() => toast.error('Gagal memuat kategori.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadCategories() }, [])

  const handleSave = async (data: { name: string; color: string }) => {
    if (editingCategory) {
      await adminUpdateCategory(editingCategory.id, data)
      toast.success('Kategori diperbarui.')
    } else {
      await adminCreateCategory(data)
      toast.success('Kategori ditambahkan.')
    }
    loadCategories()
    setEditingCategory(null)
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return
    try {
      await adminDeleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success('Kategori dihapus.')
    } catch {
      toast.error('Gagal menghapus kategori.')
    }
  }

  const openCreate = () => { setEditingCategory(null); setModalOpen(true) }
  const openEdit = (cat: Category) => { setEditingCategory(cat); setModalOpen(true) }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-3xl text-white">Kategori</h1>
          <p className="text-slate-400 mt-1">{categories.length} kategori terdaftar</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-colors"
        >
          <PlusCircle size={16} />
          Tambah Kategori
        </button>
      </div>

      <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e2e] bg-[#0d0d14]">
              <th className="text-left px-6 py-3 text-slate-500 font-medium">Warna</th>
              <th className="text-left px-6 py-3 text-slate-500 font-medium">Nama</th>
              <th className="text-left px-6 py-3 text-slate-500 font-medium">Hex</th>
              <th className="text-right px-6 py-3 text-slate-500 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="border-b border-[#1e1e2e]/50">
                  {[1, 2, 3, 4].map((j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-[#1e1e2e] rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                  <Tag size={32} className="mx-auto mb-3 opacity-20" />
                  <p>Belum ada kategori.</p>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b border-[#1e1e2e]/50 hover:bg-[#1a1a24] transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: cat.color }} />
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      {cat.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{cat.color}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-2 bg-[#1e1e2e] hover:bg-indigo-900/40 hover:text-indigo-400 text-slate-400 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 bg-[#1e1e2e] hover:bg-red-900/40 hover:text-red-400 text-slate-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
