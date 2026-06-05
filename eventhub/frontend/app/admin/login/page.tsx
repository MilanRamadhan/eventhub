'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { login } from '@/lib/api'
import { setToken } from '@/lib/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Email dan password wajib diisi.')
      return
    }
    setLoading(true)
    try {
      const data = await login(email, password)
      setToken(data.token)
      toast.success('Login berhasil!')
      router.push('/admin/dashboard')
    } catch (err: any) {
      const msg = err?.message || 'Login gagal. Periksa kembali email dan password.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        {/* Card */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="font-syne font-extrabold text-2xl text-white">
              Event<span className="text-indigo-400">Hub</span>
            </span>
            <p className="text-slate-400 text-sm mt-2">Admin Panel</p>
          </div>

          <h1 className="font-syne font-bold text-xl text-white mb-1">Masuk ke Dashboard</h1>
          <p className="text-slate-500 text-sm mb-6">Masukkan kredensial admin Anda untuk melanjutkan.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@eventhub.com"
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 text-slate-200 placeholder:text-slate-600 rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 text-slate-200 placeholder:text-slate-600 rounded-lg pl-10 pr-11 py-3 text-sm outline-none transition-colors"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Masuk
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-6">
            Admin default: admin@eventhub.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
