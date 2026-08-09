import { Link, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {
  FileText,
  Folder,
  User,
  Bell,
  RefreshCw,
  ExternalLink,
  LogOut,
} from 'lucide-react'

const navLinkClass = (isActive) =>
  isActive
    ? 'flex items-center gap-3 px-4 py-3 text-sm font-medium bg-[#e4e1da] text-[#222222] rounded-xl transition-colors'
    : 'flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-[#e4e1da]/50 hover:text-[#222222] rounded-xl transition-colors'

export function AdminSidebar() {
  const { logout } = useAuth()
  const location = useLocation()

  const isArticleActive =
    location.pathname === '/admin' ||
    location.pathname.startsWith('/admin/create-article') ||
    location.pathname.startsWith('/admin/edit-article')

  const isCategoryActive =
    location.pathname === '/admin/category' ||
    location.pathname.startsWith('/admin/create-category') ||
    location.pathname.startsWith('/admin/edit-category')

  const isProfileActive = location.pathname === '/admin/profile'
  const isNotificationActive = location.pathname === '/admin/notification'
  const isResetPasswordActive = location.pathname === '/admin/reset-password'

  const handleLogout = () => {
    // logout() ใน AuthProvider จะ clear token + navigate('/') ให้แล้ว
    logout()
  }

  return (
    <aside className="w-64 bg-[#f2f0eb] border-r border-gray-200/60 flex flex-col justify-between p-6 shrink-0">
      <div>
        <div className="mb-8">
          <Link to="/" className="text-[32px] font-bold text-[#333333] tracking-[-1px]">
            hh<span className="text-[#2ecc71]">.</span>
          </Link>
          <p className="text-[#e67e22] text-sm font-semibold mt-1">Admin panel</p>
        </div>

        <nav className="flex flex-col gap-1">
          <Link to="/admin" className={navLinkClass(isArticleActive)}>
            <FileText size={18} className={isArticleActive ? 'text-gray-600' : undefined} />
            <span>Article management</span>
          </Link>

          <Link to="/admin/category" className={navLinkClass(isCategoryActive)}>
            <Folder size={18} className={isCategoryActive ? 'text-gray-600' : undefined} />
            <span>Category management</span>
          </Link>

          <Link to="/admin/profile" className={navLinkClass(isProfileActive)}>
            <User size={18} className={isProfileActive ? 'text-gray-600' : undefined} />
            <span>Profile</span>
          </Link>

          <Link to="/admin/notification" className={navLinkClass(isNotificationActive)}>
            <Bell size={18} className={isNotificationActive ? 'text-gray-600' : undefined} />
            <span>Notification</span>
          </Link>

          <Link to="/admin/reset-password" className={navLinkClass(isResetPasswordActive)}>
            <RefreshCw size={18} className={isResetPasswordActive ? 'text-gray-600' : undefined} />
            <span>Reset password</span>
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-1 pt-6 border-t border-gray-300/40">
        <Link to="/" className={navLinkClass(false)}>
          <ExternalLink size={18} />
          <span>hh. website</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors text-left"
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
