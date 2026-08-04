import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Copy, Smile, X } from 'lucide-react'
import Markdown from 'markdown-to-jsx'
import { Nav, Footer } from '../components/WebSection.jsx'
import { toast } from 'sonner'
import { fetchAllPosts } from '../../lib/postsApi'

export default function ViewPage() {
  const { id } = useParams() // ดึง id จาก URL
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comment, setComment] = useState('')

  // 1. เพิ่ม State เช็คว่า Login หรือยัง (ตัวอย่างสมมติเป็น false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) 
  // 2. เพิ่ม State สำหรับควบคุมการแสดงผลของ Auth Modal Popup
  const [showAuthModal, setShowAuthModal] = useState(false)

  // สร้าง State เก็บรายการคอมเมนต์ (ตัวอย่างจำลองจากภาพ)
  const [commentsList, setCommentsList] = useState([
    {
      id: 1,
      author: 'Jacob Lash',
      date: '12 September 2024 at 18:30',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      content: 'I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.'
    }
  ])

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setIsLoading(true)
        const allPosts = await fetchAllPosts()
        const foundPost = allPosts.find((item) => Number(item.id) === Number(id))
        
        if (foundPost) {
          setPost(foundPost)
          setLikeCount(foundPost.likes || 0)
        } else {
          setPost(null)
        }
      } catch (error) {
        console.error('Error fetching post detail:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPostDetail()
  }, [id])

  const handleLike = () => {
    // ตรวจสอบว่าผู้ใช้ล็อกอินหรือยัง ถ้ายังไม่ได้ล็อกอิน ให้เด้งหน้าต่าง Modal ขึ้นมา
    if (!isLoggedIn) {
      setShowAuthModal(true)
      return // หยุดการทำงาน ไม่ให้เพิ่มหรือลด Like จนกว่าจะล็อกอิน
    }

    // ถ้าล็อกอินแล้ว ทำงานตามปกติ
    if (!liked) {
      setLikeCount((prev) => prev + 1)
      setLiked(true)
    } else {
      setLikeCount((prev) => prev - 1)
      setLiked(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  
    // เปลี่ยนจาก alert() เป็น toast ของ Sonner
    toast.success('Copied!', {
      description: 'This article has been copied to your clipboard.',
      duration: 3000, // แสดงผล 3 วินาที
      unstyled: true, // ปิดสไตล์เริ่มต้นของ Sonner เพื่อใช้ Tailwind ของเราเองแบบ 100%
      classNames: {
        toast: 'w-full max-w-[350px] bg-[#2ecc71] text-white flex items-start justify-between p-4 rounded-xl shadow-md font-sans antialiased relative',
        title: 'text-base font-bold block mb-1',
        description: 'text-sm text-white/90 font-light block pr-6',
        closeButton: 'absolute top-3 right-3 text-white/80 hover:text-white transition-colors',
      },
      // เพิ่มปุ่มปิดกากบาท (X) มุมขวาบนตามภาพตัวอย่าง
      closeButton: true, 
    })
  }

// 3. ปรับฟังก์ชันเมื่อกดส่งคอมเมนต์ให้ตรวจสอบสถานะการ Login
const handleSubmitComment = (e) => {
  e.preventDefault()
  if (!comment.trim()) return

  // ถ้าผู้ใช้ยังไม่ได้ Login ให้เด้ง Modal ขึ้นมา แล้วหยุดการทำงานของฟังก์ชันทันที
  if (!isLoggedIn) {
    setShowAuthModal(true)
    return
  }

    const newComment = {
      id: Date.now(),
      author: 'You', // หรือดึงชื่อ User จากระบบจริง
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) + ` at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', // Avatar สมมติ
      content: comment
    }

    setCommentsList([newComment, ...commentsList])
    setComment('') // ล้างกล่องพิมพ์
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf8]">
        <p className="text-gray-500 text-lg">Loading article...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fbfaf8]">
        <Nav />
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-lg">❌ ค้นหาบทความ ID: {id} นี้ไม่พบในระบบ</p>
          <Link to="/" className="text-blue-500 underline">กลับหน้าหลัก</Link>
        </div>
        <Footer />
      </div>
    )
  }

  // ปรับการแสดงผลวันที่ให้เป็นแบบ 11 September 2024 สอดคล้องกับภาพ
  const formattedDate = post?.date 
    ? new Date(post.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : ''

  return (
    <div className="min-h-screen bg-[#fbfaf8] flex flex-col font-sans antialiased text-[#222222]">
      <Nav />

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 py-8 md:py-12">
        {/* Banner ภาพหลักหัวข้อบทความ */}
        <div className="w-full aspect-[21/9] md:aspect-[2.4/1] rounded-[24px] overflow-hidden mb-8 shadow-sm">
          <img
            src={post?.image}
            alt={post?.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ตารางแบ่ง Grid ซ้าย-ขวา */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ฝั่งซ้าย: เนื้อหาบทความ (Main Content Area) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-[#e8f8f0] text-[#2ecc71] px-3 py-1 rounded-full font-medium text-xs">
                {post?.category || 'General'}
              </span>
              <span className="text-[#888888] font-light">{formattedDate}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#222222] leading-tight tracking-tight">
              {post?.title}
            </h1>

            <p className="text-base text-[#555555] leading-relaxed italic border-l-4 border-gray-300 pl-4 py-1 font-light">
              {post?.description}
            </p>

            {/* เนื้อหาบทความหลักที่ Render มาจาก Markdown */}
            <div className="text-[#333333] text-[15px] md:text-base leading-relaxed space-y-4 font-light article-content">
              {post?.content ? (
                <Markdown
                  options={{
                    overrides: {
                      h2: { component: ({ children }) => <h2 className="text-xl font-bold text-[#222222] mt-8 mb-3 block">{children}</h2> },
                      p: { component: ({ children }) => <p className="mb-4 text-[#444444] font-light leading-relaxed">{children}</p> },
                    },
                  }}
                >
                  {post.content}
                </Markdown>
              ) : (
                <p className="text-gray-400">ไม่มีเนื้อหาสำหรับบทความนี้</p>
              )}
            </div>

            {/* ─── ส่วนที่เพิ่มขึ้นมาตามภาพ ─── */}
            {/* แถบ Action Bar (Like / Copy link / Social Shares) */}
            <div className="mt-12 bg-[#F5F4F0] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              {/* ปุ่ม Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-sm font-medium ${
                  liked 
                    ? 'border-red-400 bg-red-50 text-red-500 shadow-sm' 
                    : 'border-gray-300 bg-white text-[#222222] hover:bg-gray-50'
                }`}
              >
                <Smile size={18} className={liked ? 'fill-red-500 stroke-red-500' : 'text-[#555555]'} />
                <span>{likeCount}</span>
              </button>

              {/* ปุ่มแชร์ต่าง ๆ */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-gray-300 text-sm text-[#222222] hover:bg-gray-50 font-medium transition-all"
                >   
                  <Copy size={16} className="text-[#555555]" />
                  <span>Copy link</span>
                </button>
                
                {/* ปุ่ม Social Media ตามเฉดสีจริงในรูปภาพ */}
                <a 
                 href={`https://www.facebook.com/share.php?u=${encodeURIComponent(window.location.href)}`}
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity"
                 >
                f
               </a>
               {/* LinkedIn Share Link */}
               <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#0077B5] text-white flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity"
               >
               in
               </a>
               {/* Twitter/X Share Link */}
               <a 
                href={`https://www.twitter.com/share?&url=${encodeURIComponent(window.location.href)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity"
               >
               t
               </a>
              </div>
            </div>

            {/* ฟอร์มสำหรับการเขียนคอมเมนต์ (Comment Box) */}
            <form onSubmit={handleSubmitComment} className="pt-8 border-t border-gray-200 space-y-3">
              <label className="block text-sm font-medium text-[#666666]">
                Comment
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full p-4 rounded-xl border border-gray-200 bg-white shadow-none focus:outline-none focus:border-gray-400 text-[15px] text-[#222222] placeholder-gray-400 transition-all resize-none font-light"
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-[#222220] hover:bg-[#333331] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
                >
                  Send
                </button>
              </div>
            </form>

            {/* ส่วนจัดแสดงรายการที่มีคนเข้ามาคอมเมนต์ (Comments Feed) */}
            <div className="pt-6 space-y-6">
              {commentsList.map((item) => (
                <div key={item.id} className="flex gap-4 items-start pt-4 border-b border-gray-100 pb-4 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.avatar} 
                      alt={item.author} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <span className="font-bold text-[#222222] text-[15px]">{item.author}</span>
                      <span className="text-xs text-[#888888] font-light">{item.date}</span>
                    </div>
                    <p className="text-sm text-[#444444] leading-relaxed font-light">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ฝั่งขวา: รายละเอียดผู้เขียน (Author Sidebar Card) */}
          <div className="bg-[#f5f4f0] p-6 rounded-[20px] border border-gray-100 space-y-4 lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
                  alt={post?.author || 'Author'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#888888] block font-medium">-Author</span>
                <h3 className="text-base font-bold text-[#222222]">{post?.author || 'Thompson P.'}</h3>
              </div>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="text-xs text-[#555555] leading-relaxed space-y-3 font-light">
              <p>
                I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
              </p>
              <p>
                When I'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      {/* ─── 4. โค้ดส่วน Create Account / Sign In Modal (แสดงผลแบบ Overlay ตามภาพ) ─── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          {/* แบ็คดรอปคลิกเพื่อปิดได้ */}
          <div className="absolute inset-0" onClick={() => setShowAuthModal(false)} />
          
          {/* ตัวกล่อง Modal หน้าต่างสีขาวโค้งมน */}
          <div className="relative w-full max-w-[420px] bg-white rounded-[24px] p-8 md:p-10 shadow-xl text-center z-10">
            {/* ปุ่มปิดกากบาท (X) ขวาบน */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* ข้อความหัวข้อ */}
            <h2 className="text-2xl md:text-[26px] font-bold text-[#111111] leading-tight tracking-tight mb-8 mt-2 px-2">
              Create an account to continue
            </h2>

            {/* ปุ่ม Create Account ตัวหนาสีดำมนยาว */}
            <button 
              onClick={() => {
                setShowAuthModal(false)
                navigate('/signup', { state: { view: 'signup' } })
              }}
              className="w-full py-3.5 bg-[#0a0a0a] hover:bg-[#222222] text-white font-medium rounded-full text-sm transition-colors shadow-sm mb-6"
            >
              Create account
            </button>

            {/* ลิงก์เข้าสู่ระบบด้านล่าง */}
            <p className="text-sm text-[#666666] font-light">
              Already have an account?{' '}
              <button 
                onClick={() => {
                  setShowAuthModal(false)
                  navigate('/login', { state: { view: 'login' } })
                }}
                className="font-semibold text-[#111111] underline hover:text-black transition-colors"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}