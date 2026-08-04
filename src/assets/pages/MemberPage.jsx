import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { User, RefreshCw, X } from 'lucide-react'
import { toast } from 'sonner'
import { Nav, Footer } from '../components/WebSection.jsx'
import { useAuth } from '../components/AuthContext'

export default function MemberPage() {
  const { user, updateUserProfile } = useAuth()
  const location = useLocation()
  const fileInputRef = useRef(null) // 🆕 ใช้สำหรับจำลองคลิกเลือกไฟล์รูปภาพ
  
  const [activeSubTab, setActiveSubTab] = useState(location.state?.activeSubTab || 'profile')

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (location.state?.activeSubTab) {
      setActiveSubTab(location.state.activeSubTab)
    }
  }, [location.state])

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  // 🆕 ฟังก์ชันจัดการอัปโหลด/เปลี่ยนรูปโปรไฟล์ (แปลงเป็นแบบ Preview ทันที)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file) // สร้าง URL จำลองของรูปภาพ
      setProfileData((prev) => ({ ...prev, avatar: imageUrl }))
    }
  }

  // ⚡️ ฟังก์ชันเมื่อกดปุ่ม Save โปรไฟล์
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // ตรวจสอบขั้นต้น
    if (!profileData.name.trim() || !profileData.username.trim()) {
      toast.error('Name and Username cannot be empty')
      return
    }

    // อัปเดตข้อมูลขึ้น Global State (สะท้อนไปที่ Navbar ทันที)
    updateUserProfile({
      name: profileData.name,
      username: profileData.username,
      avatar: profileData.avatar,
    })

    // 🟢 แสดงผล Custom Sonner Toast สีเขียวตามภาพเป๊ะๆ 
    toast.custom((t) => (
      <div className="flex w-full max-w-md items-center justify-between bg-[#10b981] text-white p-4 rounded-xl shadow-lg border border-[#059669] relative">
        <div className="flex flex-col gap-0.5 text-left">
          <span className="font-bold text-base">Saved profile</span>
          <span className="text-sm text-emerald-50/90 font-light">Your profile has been successfully updated</span>
        </div>
        <button 
          onClick={() => toast.dismiss(t)}
          className="text-white/80 hover:text-white transition-colors pl-4"
        >
          <X size={18} />
        </button>
      </div>
    ), {
      duration: 4000,
      position: 'bottom-right'
    })
  }

  const handlePrePasswordSubmit = (e) => {
    e.preventDefault()
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
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
    setIsModalOpen(true)
  }

  const handleConfirmReset = () => {
    setIsModalOpen(false)
    toast.success('Password reset successfully')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen w-full bg-[#fbfaf8] p-6 md:p-16 font-sans relative">
        <div className="max-w-5xl mx-auto">
          
          {/* ส่วนหัวข้อ */}
          <div className="flex items-center gap-4 mb-12">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
      alt={profileData.name}
      className="w-14 h-14 rounded-full object-cover border border-gray-200"
              />
            ) : (
              // 🟢 แสดงเป็นไอคอน Default ตามรูปภาพ
              <div className="w-14 h-14 rounded-full bg-[#726e67] flex items-center justify-center text-white border border-gray-200">
                <User size={28} strokeWidth={1.5} />
              </div>
            )}
            <div className="flex items-center gap-2 text-xl md:text-2xl font-bold text-[#222222]">
              <span>{profileData.name}</span>
              <span className="text-gray-300 font-light mx-1">|</span>
              <span className="text-gray-800">
                {activeSubTab === 'profile' ? 'Profile' : 'Reset password'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            {/* Sidebar เมนูย่อย */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('profile')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSubTab === 'profile'
                    ? 'text-[#222222] bg-white shadow-sm font-semibold'
                    : 'text-gray-500 hover:text-[#222222]'
                }`}
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('reset-password')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSubTab === 'reset-password'
                    ? 'text-[#222222] bg-white shadow-sm font-semibold'
                    : 'text-gray-500 hover:text-[#222222]'
                }`}
              >
                <RefreshCw size={16} />
                <span>Reset password</span>
              </button>
            </div>

            {/* กล่องเนื้อหาหลักฝั่งขวา */}
            <div className="md:col-span-3 bg-[#f5f4f0] rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
              {activeSubTab === 'profile' ? (
                <div className="flex flex-col items-center md:items-start">
                  
                  {/* ส่วนอัปโหลดรูปภาพตามดีไซน์ภาพตัวอย่างใหม่ */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 w-full pb-8 border-b border-gray-200/60 mb-8">
                   {profileData.avatar ? (
                       <img
                         src={profileData.avatar}
                         alt="Upload Preview"
                         className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                      />
                     ) : (
                        // 🟢 แสดงเป็นไอคอน Default วงกลมใหญ่ตามรูปภาพฝั่งขวา
                            <div className="w-24 h-24 rounded-full bg-[#726e67] flex items-center justify-center text-white shadow-md">
                            <User size={48} strokeWidth={1.2} />
                          </div>
                        )}
                    
                    {/* ซ่อนอินพุตไฟล์จริงไว้ แล้วใช้ ref สั่งเปิดแทน */}
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-6 py-2.5 rounded-full border border-gray-400 text-[#222222] bg-white hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm"
                    >
                      Upload profile picture
                    </button>
                  </div>

                  <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#666666]">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full bg-white text-sm py-3 px-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400 shadow-sm text-gray-800 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#666666]">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleInputChange}
                        className="w-full bg-white text-sm py-3 px-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400 shadow-sm text-gray-800 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-400">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full bg-transparent text-sm py-3 px-4 pl-0 rounded-xl text-gray-400 outline-none cursor-not-allowed select-none font-light"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-full bg-[#222220] hover:bg-[#333331] text-white font-medium text-sm transition-colors shadow-md"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* ฟอร์ม Reset Password */
                <div>
                  <form className="space-y-6" onSubmit={handlePrePasswordSubmit}>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#666666]">Current password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-white text-sm py-3 px-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400 shadow-sm text-gray-800 transition-all placeholder-gray-400"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#666666]">New password</label>
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-white text-sm py-3 px-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400 shadow-sm text-gray-800 transition-all placeholder-gray-400"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#666666]">Confirm new password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-white text-sm py-3 px-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400 shadow-sm text-gray-800 transition-all placeholder-gray-400"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-full bg-[#222220] hover:bg-[#333331] text-white font-medium text-sm transition-colors shadow-md"
                      >
                        Reset password
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Confirmation Modal สำหรับรีเซ็ตรหัสผ่าน */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-[#fbfaf8] w-[90%] max-w-md rounded-2xl p-6 shadow-xl relative border border-gray-100 flex flex-col items-center text-center">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
            <h3 className="text-xl font-bold text-[#222222] mt-2 mb-3">Reset password</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">Do you want to reset your password?</p>
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
      )}
    </>
  )
}