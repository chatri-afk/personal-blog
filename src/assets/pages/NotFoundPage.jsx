import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Nav, Footer } from '../components/WebSection.jsx' // เปลี่ยน path ให้ตรงกับที่เก็บไฟล์จริงของคุณ

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-[#222222]">
      {/* ส่วนหัวของหน้าเว็บ (Navbar) */}
      <Nav />

      {/* ส่วนเนื้อหาหลักตรงกลาง (Center Content Area) */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 text-center select-none">
        <div className="max-w-md mx-auto flex flex-col items-center justify-center gap-6">
          
          {/* ไอคอนเครื่องหมายตกใจ (!) วงกลมตามภาพต้นฉบับ */}
          <div className="text-[#222220]">
            <AlertCircle size={64} strokeWidth={1.5} />
          </div>

          {/* ข้อความ Page Not Found หัวข้อหลัก */}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#222222]">
            Page Not Found
          </h1>

          {/* ปุ่มสีดำทรงมน (Pill-shaped Button) กลับหน้าหลัก */}
          <div className="mt-2">
            <Link
              to="/"
              className="inline-block bg-[#222220] hover:bg-[#333331] text-white text-sm font-medium px-8 py-3 rounded-full shadow-none transition-colors duration-200"
            >
              Go To Homepage
            </Link>
          </div>

        </div>
      </main>

      {/* ส่วนท้ายของหน้าเว็บ (Footer) */}
      <Footer />
    </div>
  )
}