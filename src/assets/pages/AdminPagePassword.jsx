import React, { useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { Nav, Footer } from '../components/WebSection.jsx'
import { AdminSidebar } from '../components/AdminSidebar.jsx'

export default function AdminPagePassword() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePrePasswordSubmit = (e) => {
    e?.preventDefault()

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error('Please fill in all fields')
      return
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('New password must be different from the current password')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }

    setIsModalOpen(true)
  }

  const handleConfirmReset = () => {
    setIsModalOpen(false)
    toast.custom(
      (t) => (
        <div
          className="flex items-start justify-between bg-[#12b76a] text-white p-4 rounded-xl shadow-lg relative box-border"
          style={{ width: '100%' }}
        >
          <div className="flex flex-col gap-0.5 text-left pr-8">
            <span className="font-semibold text-[15px] tracking-wide whitespace-nowrap">
              Password reset successfully
            </span>
            <span className="text-sm text-white/90 font-light whitespace-nowrap">
              Your password has been successfully updated
            </span>
          </div>
          <button
            type="button"
            onClick={() => toast.dismiss(t)}
            className="absolute right-3 top-3 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      ),
      {
        duration: 4000,
        position: 'bottom-right',
        unstyled: true,
        style: {
          width: '560px',
          maxWidth: 'calc(100vw - 2rem)',
          ['--width']: '560px',
        },
        className: 'article-toast',
      }
    )
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <>
      <Nav />
      <div className="flex min-h-screen bg-[#f7f6f4] text-[#333333] font-sans">
        <AdminSidebar />

        <main className="flex-1 flex flex-col bg-white">
          <header className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-[#222222]">Reset password</h1>
            <button
              type="button"
              onClick={handlePrePasswordSubmit}
              className="px-6 py-2.5 bg-[#222220] hover:bg-[#333331] text-white text-sm font-medium rounded-full transition-colors shadow-sm"
            >
              Reset password
            </button>
          </header>

          <section className="p-10 flex flex-col gap-6 bg-[#faf9f6] flex-1">
            <form onSubmit={handlePrePasswordSubmit} className="flex flex-col gap-5 max-w-md">
              <div className="flex flex-col gap-2">
                <label htmlFor="currentPassword" className="text-sm font-medium text-gray-600">
                  Current password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  placeholder="Current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm placeholder-gray-400 text-[#222222]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-600">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm placeholder-gray-400 text-[#222222]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-600">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm placeholder-gray-400 text-[#222222]"
                />
              </div>
            </form>
          </section>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-[#fbfaf8] w-[90%] max-w-md rounded-2xl px-6 pt-8 pb-6 shadow-xl relative border border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex flex-col items-center text-center gap-5">
              <h3 className="text-xl font-bold text-[#222222]">Reset password</h3>
              <p className="text-sm text-gray-500 font-medium">
                Do you want to reset your password?
              </p>
              <div className="flex items-center gap-3 w-full justify-center">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 min-w-[100px] rounded-full border border-gray-300 text-gray-700 bg-white text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-6 py-2.5 min-w-[100px] rounded-full bg-[#222220] text-white text-sm font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
