import { useState, useEffect } from 'react'
import axios from 'axios'
import { ExternalLink, GitBranch, Globe, Menu, Search } from 'lucide-react'
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

const TAB_OPTIONS = [
  { value: 'highlight', label: 'Highlight' },
  { value: 'cat', label: 'Cat' },
  { value: 'inspiration', label: 'Inspiration' },
  { value: 'general', label: 'General' },
]

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    // เพิ่ม relative เข้ามาที่ <nav> เพื่อให้ตัวเมนูดรอปดาวน์อ้างอิงตำแหน่งได้ถูกต้อง
    <nav className="relative flex w-full items-center justify-between bg-[#fcfcfc] px-4 py-[15px] border-b-2 border-[#3498db] md:px-10 z-50">
      
      {/* โลโก้ */}
      <div className="text-[28px] md:text-[32px] font-bold text-[#333333] tracking-[-1px]">
        hh<span className="text-[#2ecc71]">.</span>
      </div>

      {/* เมนูสำหรับหน้าจอขนาดใหญ่ (Desktop) */}
      <div className="hidden md:flex gap-3">
        <a href="#" className="inline-block text-[16px] font-medium px-7 py-2.5 rounded-[25px] text-[#222222] border border-[#777777] bg-transparent transition-all duration-200 ease-in-out hover:bg-[#eeeeee]">
          Log in
        </a>
        <a href="#" className="inline-block text-[16px] font-medium px-7 py-2.5 rounded-[25px] text-white bg-[#222220] border border-[#222220] transition-all duration-200 ease-in-out hover:bg-[#333331]">
          Sign up
        </a>
      </div>

      {/* ปุ่ม Hamburger สําหรับ Mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)} // กดแล้วสลับสถานะเปิด-ปิด
        className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-[#333333] hover:bg-[#eeeeee] transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* แผงเมนูดรอปดาวน์สไตล์ Mobile (จะแสดงผลเมื่อ isOpen = true เท่านั้น) */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#fcfcfc] border-t border-gray-200 px-6 py-8 flex flex-col gap-4 md:hidden shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <a
            href="#"
            className="w-full text-center text-[16px] font-medium px-7 py-3 rounded-[30px] text-[#222222] border border-[#777777] bg-transparent transition-all duration-200 ease-in-out hover:bg-[#eeeeee]"
          >
            Log in
          </a>
          <a
            href="#"
            className="w-full text-center text-[16px] font-medium px-7 py-3 rounded-[30px] text-white bg-[#222220] border border-[#222220] transition-all duration-200 ease-in-out hover:bg-[#333331]"
          >
            Sign up
          </a>
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
          <a 
            href="#" 
            className="text-sm font-medium text-[#333333] underline underline-offset-4 hover:text-black transition-colors"
          >
            Home page
          </a>
        </div>

      </div>
    </footer>
  )
}

export function ArticleSection () {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('highlight')
  
  // States สำหรับจัดการข้อมูลจาก API
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API
  const fetchBlogPosts = async (currentPage, categoryTab, search, isLoadMore = false) => {
    try {
      setIsLoading(true)
      
      // เตรียม Query Parameters สำหรับส่งให้ API
      const params = {
        page: currentPage,
        // ถ้าแท็บเป็น highlight ไม่ต้องส่งคิวรี่ category เพื่อให้ดึงทั้งหมด (หรือตามเงื่อนไขหลังบ้าน)
        ...(categoryTab !== 'highlight' && { category: categoryTab }),
        ...(search && { search: search })
      }

      const response = await axios.get('https://blog-post-project-api.vercel.app/posts', { params })
      const data = response.data

      if (isLoadMore) {
        // ถ้ากด View more ให้เอาข้อมูลใหม่ไปต่อท้ายข้อมูลเดิม
        setPosts((prevPosts) => [...prevPosts, ...data.posts])
      } else {
        // ถ้าเปลี่ยนแท็บหรือเซิร์ชใหม่ ให้เขียนทับข้อมูลเดิมไปเลย
        setPosts(data.posts)
      }
      
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger ดึงข้อมูลใหม่เมื่อเปลี่ยนแท็บ (activeTab) หรือ หน้าเพจ (page)
  useEffect(() => {
    fetchBlogPosts(page, activeTab, searchQuery, page > 1)
  }, [page, activeTab])

  // Trigger ดึงข้อมูลเมื่อผู้ใช้พิมพ์ค้นหา (แนะนำให้ใส่ Debounce เพิ่มเติมในอนาคตเพื่อประหยัดการยิง API)
  useEffect(() => {
    setPage(1) // รีเซ็ตกลับไปหน้าแรกก่อนเสมอเมื่อมีการพิมพ์ค้นหา
    fetchBlogPosts(1, activeTab, searchQuery, false)
  }, [searchQuery])

  // ฟังก์ชันกดปุ่มโหลดข้อมูลหน้าถัดไป
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
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
        Latest articles
      </h2>

      <Tabs 
        value={activeTab} 
        onValueChange={(val) => {
          setActiveTab(val)
          setPage(1) // รีเซ็ตเพจกลับเป็นหน้าแรกเมื่อเปลี่ยนประเภทแท็บ
        }} 
        className="w-full"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#F5F4F2] p-4 md:p-2 rounded-2xl w-full">
          <div className="order-2 md:hidden w-full flex flex-col gap-1">
            <span className="text-sm text-[#999999]">Category</span>
            <Select 
              value={activeTab} 
              onValueChange={(val) => {
                setActiveTab(val)
                setPage(1)
              }}
            >
              <SelectTrigger
                className={`${mobileFieldClass} !h-auto justify-between text-[#999999] [&_[data-slot=select-value]]:text-[#999999] [&_svg]:text-[#999999] md:w-fit md:rounded-lg md:border-input md:shadow-none`}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {TAB_OPTIONS.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TabsList className="hidden md:flex bg-transparent gap-2 h-auto p-0">
            {TAB_OPTIONS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className={tabTriggerClass}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative order-1 md:order-none w-full md:max-w-[280px] md:ml-auto">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${mobileFieldClass} text-[#1A1A1A] placeholder-[#999999] pr-10 focus:border-[#D9D6D0] md:border-transparent md:shadow-sm`}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
          </div>
        </div>

        <div className="mt-8">
          <TabsContent value={activeTab} className="outline-none">
            {/* แสดงข้อความแจ้งเตือนเมื่อกำลังโหลดหน้าแรก */}
            {isLoading && page === 1 ? (
              <div className="text-center py-10 text-gray-500">Loading articles...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No articles found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <BlogCard
                    key={post.id}
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

        {/* ปุ่ม View more จะปรากฏเมื่อหน้านั้นๆ ยังมีหน้าถัดไปให้โหลดต่อได้ */}
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