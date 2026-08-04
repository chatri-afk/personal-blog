import { Link } from 'react-router-dom'
import { Nav, Footer } from '../components/WebSection.jsx'
import { AdminSidebar } from '../components/AdminSidebar.jsx'
import { MOCK_NOTIFICATIONS } from '../../data/notification.js'

function NotificationItem({ notification }) {
  const { type, userName, avatar, articleTitle, articleId, comment, timeAgo } = notification

  return (
    <div className="flex items-start gap-4 py-6 border-b border-gray-100 last:border-b-0">
      <img
        src={avatar}
        alt={userName}
        className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-100"
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#333333] leading-relaxed">
          <span className="font-semibold text-[#222222]">{userName}</span>
          {type === 'comment' ? ' Commented on your article: ' : ' liked your article: '}
          <span className="text-[#222222]">{articleTitle}</span>
        </p>

        {type === 'comment' && comment && (
          <p className="mt-2 text-sm text-gray-500 leading-relaxed italic">
            “{comment}”
          </p>
        )}

        <p className="mt-2 text-xs font-medium text-[#e67e22]">{timeAgo}</p>
      </div>

      <Link
        to={`/post/${articleId}`}
        className="shrink-0 text-sm font-medium text-[#222222] underline underline-offset-2 hover:text-black transition-colors pt-0.5"
      >
        View
      </Link>
    </div>
  )
}

export default function AdminNotificationPage() {
  return (
    <>
      <Nav />
      <div className="flex min-h-screen bg-[#f7f6f4] text-[#333333] font-sans">
        <AdminSidebar />

        <main className="flex-1 flex flex-col bg-white">
          <header className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-[#222222]">Notification</h1>
          </header>

          <section className="px-10 py-2 bg-white flex-1">
            {MOCK_NOTIFICATIONS.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </section>
        </main>
      </div>
      <Footer />
    </>
  )
}
