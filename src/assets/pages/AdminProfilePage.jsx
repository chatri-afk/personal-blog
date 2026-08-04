import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { Nav, Footer } from '../components/WebSection.jsx'
import { AdminSidebar } from '../components/AdminSidebar.jsx'
import { useAuth } from '../components/AuthContext'
import { mockAdminData, mockUsers } from '../../data/member'

// ข้อมูลสำหรับทดสอบ Admin
const adminDefaults =
  mockUsers.find((u) => u.role === 'admin') || mockAdminData

export default function AdminProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const fileInputRef = useRef(null)

  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    avatar: '',
    bio: '',
  })

  useEffect(() => {
    const source = user?.role === 'admin' ? user : adminDefaults
    setProfileData({
      name: source.name || adminDefaults.name || '',
      username: source.username || adminDefaults.username || '',
      email: source.email || adminDefaults.email || '',
      avatar: source.avatar || adminDefaults.avatar || '',
      bio: source.bio || adminDefaults.bio || '',
    })
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfileData((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }))
  }

  const handleSave = (e) => {
    e?.preventDefault()

    if (!profileData.name.trim() || !profileData.username.trim()) {
      toast.error('Name and Username cannot be empty')
      return
    }

    updateUserProfile({
      name: profileData.name.trim(),
      username: profileData.username.trim(),
      email: profileData.email.trim(),
      avatar: profileData.avatar,
      bio: profileData.bio.slice(0, 120),
    })

    toast.custom(
      (t) => (
        <div
          className="flex items-start justify-between bg-[#12b76a] text-white p-4 rounded-xl shadow-lg relative box-border"
          style={{ width: '100%' }}
        >
          <div className="flex flex-col gap-0.5 text-left pr-8">
            <span className="font-semibold text-[15px] tracking-wide whitespace-nowrap">
              Saved profile
            </span>
            <span className="text-sm text-white/90 font-light whitespace-nowrap">
              Your profile has been successfully updated
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
  }

  return (
    <>
      <Nav />
      <div className="flex min-h-screen bg-[#f7f6f4] text-[#333333] font-sans">
        <AdminSidebar />

        <main className="flex-1 flex flex-col bg-white">
          <header className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-[#222222]">Profile</h1>
            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-2.5 bg-[#222220] hover:bg-[#333331] text-white text-sm font-medium rounded-full transition-colors shadow-sm"
            >
              Save
            </button>
          </header>

          <section className="p-10 flex flex-col gap-8 bg-white flex-1 max-w-2xl">
            <div className="flex items-center gap-6">
              <img
                src={profileData.avatar || adminDefaults.avatar}
                alt={profileData.name || 'Profile'}
                className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-full border border-gray-400 text-[#222222] bg-white hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm"
              >
                Upload profile picture
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-5 w-full max-w-md">
              <div className="flex flex-col gap-2">
                <label htmlFor="admin-name" className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <input
                  id="admin-name"
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-400 shadow-sm text-[#222222]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="admin-username" className="text-sm font-medium text-gray-500">
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-400 shadow-sm text-[#222222]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="admin-email" className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-400 shadow-sm text-[#222222]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="admin-bio" className="text-sm font-medium text-gray-500">
                  Bio (max 120 letters)
                </label>
                <textarea
                  id="admin-bio"
                  name="bio"
                  rows={5}
                  maxLength={120}
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-gray-400 shadow-sm resize-none text-[#222222] leading-relaxed"
                />
              </div>
            </form>
          </section>
        </main>
      </div>
      <Footer />
    </>
  )
}
