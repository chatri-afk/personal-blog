import { useState, useEffect, useRef} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ExternalLink, GitBranch, Globe, Menu, Search, Bell, User, RefreshCw, LogOut, ChevronDown } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,  
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { BlogCard } from '@/assets/components/BlogCard'
import { useAuth } from '../components/AuthContext'
import { fetchPosts } from '../../lib/postsApi'

const TAB_OPTIONS = [
  { value: 'highlight', label: 'Highlight' },
  { value: 'cat', label: 'Cat' },
  { value: 'inspiration', label: 'Inspiration' },
  { value: 'general', label: 'General' },
]

export function Nav() {
  const { isLoggedIn, user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false) // สำหรับ Mobile Burger Menu
  const [userDropdown, setUserDropdown] = useState(false) // สำหรับ User Profile Dropdown
  
  // 🆕 1. เพิ่ม State สำหรับเปิด/ปิด Dropdown แจ้งเตือน
  const [notiDropdown, setNotiDropdown] = useState(false)
  
  // 🆕 2. เพิ่ม Ref สำหรับกล่องแจ้งเตือน
  const notiMenuRef = useRef(null)
  const userMenuRef = useRef(null)
  const navigate = useNavigate()

  // 🆕 3. จำลองข้อมูลแจ้งเตือน (Mock Data) ตรงตามภาพตัวอย่างของคุณ
  const notifications = [
    {
      id: 1,
      name: 'Thompson P.',
      action: 'Published new article.',
      time: '2 hours ago',
      avatar: 'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg',
    },
    {
      id: 2,
      name: 'Jacob Lash',
      action: 'Comment on the article you have commented on.',
      time: '12 September 2024 at 18:30',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    }
  ]

  // ดักจับการคลิกข้างนอกเพื่อปิดทั้้ง User Dropdown และ Notification Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdown(false)
      }
      // 🆕 ปิดกล่องแจ้งเตือนเมื่อคลิกข้างนอก
      if (notiMenuRef.current && !notiMenuRef.current.contains(event.target)) {
        setNotiDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setUserDropdown(false)
    setNotiDropdown(false) // 🆕 เคลียร์สถานะตอน logout
    setIsOpen(false)
    navigate('/')
  }

  return (
    <nav className="relative flex w-full items-center justify-between bg-[#fcfcfc] px-4 py-[15px] border-b border-gray-100 md:px-10 z-50">
      
      {/* โลโก้ */}
      <Link to="/" className="text-[28px] md:text-[32px] font-bold text-[#333333] tracking-[-1px]">
        hh<span className="text-[#2ecc71]">.</span>
      </Link>

      {/* เมนูสำหรับหน้าจอขนาดใหญ่ (Desktop) */}
      <div className="hidden md:flex items-center gap-6">
        {!isLoggedIn ? (
          <div className="flex gap-3">
            <Link 
              to="/login" 
              state={{ view: 'login' }}
              className="inline-block text-[16px] font-medium px-7 py-2.5 rounded-[25px] text-[#222222] border border-[#777777] bg-transparent transition-all duration-200 ease-in-out hover:bg-[#eeeeee]"
            >
              Log in
            </Link>
            <Link 
              to="/signup" 
              state={{ view: 'signup' }}
              className="inline-block text-[16px] font-medium px-7 py-2.5 rounded-[25px] text-white bg-[#222220] border border-[#222220] transition-all duration-200 ease-in-out hover:bg-[#333331]"
            >
              Sign up
            </Link>
          </div>
        ) : (
          /* แสดงส่วนนี้เมื่อ Logged In แล้ว */
          <div className="flex items-center gap-4">
            
            {/* 🆕 ปุ่มกระดิ่งแจ้งเตือนพร้อม Dropdown แสดงผลข้อมูลตามภาพ */}
            <div className="relative" ref={notiMenuRef}>
              <button 
                onClick={() => {
                  setNotiDropdown(!notiDropdown)
                  setUserDropdown(false) // ปิดเมนูผู้ใช้สลับกัน
                }}
                className="relative p-2.5 bg-white rounded-full border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm text-gray-600 focus:outline-none"
              >
                <Bell size={20} />
                {/* จุดสีแดงจะหายไปถ้าเปิดดูการแจ้งเตือนแล้ว (หรือจะเปิดค้างไว้ตามดีไซน์เดิมก็ได้ครับ) */}
                {!notiDropdown && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff4d4f] rounded-full"></span>
                )}
              </button>

              {/* 🆕 Dropdown กล่องแจ้งเตือนสไตล์มินิมอลตามแบบ */}
              {notiDropdown && (
                <div className="absolute right-0 mt-3 w-80 md:w-[380px] bg-[#fbfaf8] border border-gray-100 rounded-2xl shadow-xl p-5 z-50 text-[#333333] flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  {notifications.map((noti) => (
                    <div key={noti.id} className="flex gap-3.5 items-start">
                      {/* รูป Avatar คนแจ้งเตือน */}
                      <img 
                        src={noti.avatar} 
                        alt={noti.name} 
                        className="w-11 h-11 rounded-full object-cover shrink-0" 
                      />
                      
                      {/* ข้อความและเวลาสีส้มพีชตามภาพ */}
                      <div className="flex flex-col text-left">
                        <p className="text-sm text-gray-600 font-normal leading-snug">
                          <strong className="text-[#222222] font-bold">{noti.name}</strong> {noti.action}
                        </p>
                        <span className="text-[12px] text-[#f39c12] mt-1 font-medium">
                          {noti.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* เมนูโปรไฟล์ผู้ใช้ */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => {
                  setUserDropdown(!userDropdown)
                  setNotiDropdown(false) // ปิดกล่องแจ้งเตือนสลับกัน
                }}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
              >
                <img 
                  src={user?.avatar || 'https://via.placeholder.com/150'} 
                  alt={user?.name || 'User'} 
                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                />
                <span className="text-sm font-medium text-[#333333]">{user?.name}</span>
                <ChevronDown size={14} className="text-gray-500" />
              </button>

              {/* Dropdown เมนูหลัง Login */}
              {userDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-1 z-50 text-[#333333] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link 
                    to="/member" 
                    state={{ activeSubTab: 'profile' }}
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} className="text-gray-500" />
                    <span>Profile</span>
                  </Link>
                  <Link 
                    to="/member" 
                    state={{ activeSubTab: 'reset-password' }}
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <RefreshCw size={16} className="text-gray-500" />
                    <span>Reset password</span>
                  </Link>

                  {/* 🆕 เพิ่มตรงนี้: แสดงเฉพาะผู้ใช้ที่มี role เป็น admin เท่านั้น */}
                      {user?.role === 'admin' && (
                        <Link 
                          to="/admin" // เปลี่ยน path ลิงก์ไปยังหน้าแอดมินของคุณได้ที่นี่
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          <ExternalLink size={16} className="text-gray-500" /> {/* หรือใช้ไอคอนอื่นที่ชอบได้ครับ */}
                          <span>Admin panel</span>
                        </Link>
                      )}

                  {/* คั่นเส้นขอบก่อนปุ่ม Log out */}
                  <div className="border-t border-gray-100 my-1"></div>

                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ปุ่ม Hamburger สําหรับ Mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-[#333333] hover:bg-[#eeeeee] transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#fcfcfc] border-t border-gray-200 px-6 py-8 flex flex-col gap-4 md:hidden shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-[16px] font-medium px-7 py-3 rounded-[30px] text-[#222222] border border-[#777777] bg-transparent hover:bg-[#eeeeee]"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-[16px] font-medium px-7 py-3 rounded-[30px] text-white bg-[#222220] border border-[#222220] hover:bg-[#333331]"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/member"
                state={{ activeSubTab: 'profile' }}
                onClick={() => setIsOpen(false)}
                className="text-center font-medium py-2 hover:bg-gray-50 rounded-lg"
              >
                Profile
              </Link>
              <Link
                to="/member"
                state={{ activeSubTab: 'reset-password' }}
                onClick={() => setIsOpen(false)}
                className="text-center font-medium py-2 hover:bg-gray-50 rounded-lg"
              >
                Reset Password
              </Link>
              {/* 🆕 เพิ่มตรงนี้: แสดงเฉพาะผู้ใช้ที่มี role เป็น admin เท่านั้น */}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" // เปลี่ยน path ลิงก์ไปยังหน้าแอดมินของคุณได้ที่นี่
                  onClick={() => setIsOpen(false)}
                  className="text-center font-medium py-2 hover:bg-gray-50 rounded-lg"
                >
                  Admin panel
                </Link>
              )}
              <button onClick={handleLogout} className="text-center font-medium py-2 text-red-500 hover:bg-red-50 rounded-lg">
                Log out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export function HeroSection() {
  return (
    <section className="min-h-screen w-full bg-[#fbfaf8] flex items-center justify-center p-6 md:p-12">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
        <div className="text-right flex flex-col items-end justify-center order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#222222] leading-tight mb-6 tracking-tight">
            Stay<br />
            Informed,<br />
            Stay Inspired
          </h1>
          <p className="text-sm md:text-base text-[#666666] max-w-sm leading-relaxed font-light">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
          </p>
        </div>
        <div className="flex justify-center order-2">
          <div className="w-full max-w-[380px] aspect-[3/4] overflow-hidden rounded-[24px]">
          <img 
          src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" 
          alt="Man with a cat on his shoulder in autumn forest" 
          className="w-full h-full object-cover"
          />
        </div>
     </div>

    <div className="text-left flex flex-col justify-center order-3 text-[#555555]">
      <span className="text-xs text-[#888888] uppercase tracking-wider mb-2 font-medium">-Author</span>
      <h2 className="text-2xl md:text-3xl font-bold text-[#222222] mb-4">Thompson P.</h2>
        <div className="space-y-4 text-sm md:text-base leading-relaxed font-light">
          <p>
          I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
          </p>
         <p>
          When I'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.
          </p>
        </div>
      </div>
    </div>
    </section>
  )
}

export function Footer () {
  return (
    <footer className="w-full bg-[#f5f4f0] text-[#333333] py-8 px-6 md:px-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* ฝั่งซ้าย: โซเชียลและ Get in touch */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[#555555]">Get in touch</span>
          
          <div className="flex items-center gap-2">
            {/* LinkedIn / External link */}
            <a 
              href="#" 
              className="p-1.5 bg-[#333333] text-white rounded-full hover:bg-black transition-colors"
              aria-label="LinkedIn"
            >
              <ExternalLink size={16} fill="currentColor" strokeWidth={0} />
            </a>

            {/* GitHub / Git branch */}
            <a 
              href="#" 
              className="p-1.5 bg-[#333333] text-white rounded-full hover:bg-black transition-colors"
              aria-label="GitHub"
            >
              <GitBranch size={16} fill="currentColor" strokeWidth={0} />
            </a>

            {/* Website / Globe */}
            <a 
              href="#" 
              className="p-1.5 bg-[#333333] text-white rounded-full hover:bg-black transition-colors"
              aria-label="Website"
            >
              <Globe size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>

        {/* ฝั่งขวา: ลิงก์เมนู */}
        <div>
        <Link 
            to="/" 
            className="text-sm font-medium text-[#333333] underline underline-offset-4 hover:text-black transition-colors"
          >
            Home page
          </Link>
        </div>

      </div>
    </footer>
  )
}

export function ArticleSection () {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  
  // ─── ใช้ State ตามที่คุณกำหนด ───
  const [searchKeyword, setSearchKeyword] = useState('')      // เก็บข้อความในช่อง Input ค้นหา
  const [suggestedPosts, setSuggestedPosts] = useState([])    // เก็บรายการผลลัพธ์เพื่อนำไป .map
  const [searchDropdown, setSearchDropdown] = useState(false) // ควบคุมการเปิด/ปิด Dropdown

  const [searchQuery, setSearchQuery] = useState('') // Keyword หลักที่กดยืนยัน (Enter) เพื่อกรองการแสดงผลด้านล่าง
  const [activeTab, setActiveTab] = useState('highlight')
  
  // States สำหรับจัดการข้อมูลหลักจาก API
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false) // สถานะ Loading เฉพาะของช่องค้นหา

  // 1. useEffect สำหรับดึงโพสต์หลัก (แสดงด้านล่าง)
  const fetchBlogPosts = async (currentPage, categoryTab, search, isLoadMore = false) => {
    try {
      setIsLoading(true)
      const data = await fetchPosts({
        page: currentPage,
        category: categoryTab,
        keyword: search,
      })

      if (isLoadMore) {
        setPosts((prevPosts) => [...prevPosts, ...data.posts])
      } else {
        setPosts(data.posts)
      }
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogPosts(page, activeTab, searchQuery, page > 1)
  }, [page, activeTab, searchQuery])


  // 2. 🟢 useEffect ตัวใหม่สำหรับดึงข้อมูลใส่ดรอปดาวน์ตาม searchKeyword (พร้อม Debounce 300ms)
  useEffect(() => {
    const keyword = searchKeyword.trim()
    
    // ถ้าช่องค้นหาว่าง ให้เคลียร์ค่าแนะนำและปิด Dropdown
    if (!keyword) {
      setSuggestedPosts([])
      setIsSearching(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true)
        const data = await fetchPosts({ page: 1, limit: 10, keyword })
        setSuggestedPosts(data.posts)
      } catch (error) {
        console.error('Error fetching search suggestions:', error)
        setSuggestedPosts([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchKeyword])


  // 3. useEffect สำหรับดักจับการคลิกข้างนอกเพื่อปิด Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ฟังก์ชันกดยืนยันการค้นหา (กด Enter)
  const handleSearchSubmit = () => {
    setSearchDropdown(false)
    setPage(1)
    setSearchQuery(searchKeyword.trim())
  }

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const tabTriggerClass =
    'px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 !text-[#999999] hover:bg-[#F0EEEA] hover:text-[#1A1A1A] data-[state=active]:bg-[#D9D6D0] data-[state=active]:!text-[#1A1A1A] data-[state=active]:hover:bg-[#D9D6D0] data-[state=active]:shadow-none'

  const mobileFieldClass =
    'w-full bg-white text-sm py-2.5 px-4 rounded-xl border border-[#D9D6D0] shadow-none outline-none transition-all'

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 pt-8 pb-0 md:p-8 md:pb-8 font-sans">
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Latest articles</h2>

      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setPage(1); }} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#F5F4F2] p-4 md:p-2 rounded-2xl w-full">
          
          {/* Select Category สำหรับ Mobile */}
          <div className="order-2 md:hidden w-full flex flex-col gap-1">
            <span className="text-sm text-[#999999]">Category</span>
            <Select value={activeTab} onValueChange={(val) => { setActiveTab(val); setPage(1); }}>
              <SelectTrigger className={`${mobileFieldClass} !h-auto justify-between text-[#999999] [&_[data-slot=select-value]]:text-[#999999] [&_svg]:text-[#999999]`}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {TAB_OPTIONS.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs สำหรับ Desktop */}
          <TabsList className="hidden md:flex bg-transparent gap-2 h-auto p-0">
            {TAB_OPTIONS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className={tabTriggerClass}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ─── 🟡 กล่องค้นหาที่ปรับใช้ State ใหม่ของคุณ ─── */}
          <div ref={dropdownRef} className="relative order-1 md:order-none w-full md:max-w-[280px] md:ml-auto z-50">
            <input
              type="text"
              placeholder="Search"
              value={searchKeyword} // เปลี่ยนเป็น searchKeyword
              onChange={(e) => setSearchKeyword(e.target.value)} // เปลี่ยนเป็น setSearchKeyword
              onFocus={() => setSearchDropdown(true)} // เปลี่ยนเป็น setSearchDropdown(true)
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearchSubmit()
                }
              }}
              className={`${mobileFieldClass} text-[#1A1A1A] placeholder-[#999999] pr-10 focus:border-[#D9D6D0] md:border-transparent md:shadow-sm`}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />

            {/* ส่วนดรอปดาวน์ที่ตรวจสอบเงื่อนไขจาก searchDropdown */}
            {searchDropdown && searchKeyword.trim() !== '' && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 max-h-[300px] overflow-y-auto">
                {isSearching ? (
                  <div className="px-5 py-3 text-xs text-gray-400 text-left">Searching...</div>
                ) : suggestedPosts.length === 0 ? ( // เปลี่ยนมาตรวจจาก suggestedPosts
                  <div className="px-5 py-3 text-xs text-gray-400 text-left">No results found</div>
                ) : (
                  // 🟢 เปลี่ยนมาใช้ suggestedPosts.map() ตามต้องการ
                  suggestedPosts.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        setSearchDropdown(false) // ปิด dropdown เมื่อกดเลือก
                        navigate(`/post/${result.id}`)
                      }}
                      className="w-full text-left px-5 py-2.5 text-sm font-medium text-[#222222] hover:bg-[#F0EEEA] transition-colors duration-150 line-clamp-1 block select-none"
                    >
                      {result.title}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content & List Articles ด้านล่าง */}
        <div className="mt-8">
          <TabsContent value={activeTab} className="outline-none">
            {isLoading && page === 1 ? (
              <div className="text-center py-10 text-gray-500">Loading articles...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No articles found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <BlogCard
                    key={post.id}
                    id={post.id}
                    image={post.image}
                    category={post.category}
                    title={post.title}
                    description={post.description}
                    author={post.author}
                    date={post.date}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </div>

        {/* Button Load More */}
        {page < totalPages && (
          <div className="mt-8 flex justify-center pb-4 md:pb-0">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoading}
              className="inline-block rounded-[25px] border border-[#777777] bg-transparent px-7 py-2.5 text-base font-medium text-[#222222] transition-all duration-200 ease-in-out hover:bg-[#eeeeee] disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'View more'}
            </button>
          </div>
        )}
      </Tabs>
    </section>
  )
}