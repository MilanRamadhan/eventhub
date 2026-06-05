'use client'
import { Toaster } from 'react-hot-toast'

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#111118',
          color: '#f1f5f9',
          border: '1px solid #1e1e2e',
          borderRadius: '12px',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#111118' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#111118' },
        },
      }}
    />
  )
}
