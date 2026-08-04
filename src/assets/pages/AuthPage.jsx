import { Nav, Footer } from '../components/WebSection.jsx'
import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import { mockUsers } from '../../data/member'

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  // สเตทสำหรับควบคุมการแสดงหน้าจอ: 'signup' | 'login' | 'success'
  const [authView, setAuthView] = useState(() => {
    if (location.state?.view) return location.state.view
    return location.pathname === '/login' ? 'login' : 'signup'
  })

  // sync จาก path / state เมื่อกด Log in / Sign up จาก Nav
  useEffect(() => {
    if (location.state?.view) {
      setAuthView(location.state.view)
      return
    }
    if (location.pathname === '/login') {
      setAuthView('login')
      return
    }
    if (location.pathname === '/signup') {
      // คงหน้า success ไว้หลังสมัครสำเร็จ จนกว่าจะกด Nav / Continue
      setAuthView((current) => (current === 'success' ? current : 'signup'))
    }
  }, [location.pathname, location.state])

  // ─── SIGN UP STATES & VALIDATION ───
  const [signupForm, setSignupForm] = useState({ name: '', username: '', email: '', password: '' })
  const [signupErrors, setSignupErrors] = useState({})

  const validateSignup = () => {
    const errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!signupForm.name.trim()) errors.name = 'Name is required'
    if (!signupForm.username.trim()) errors.username = 'Username is required'
    if (!signupForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(signupForm.email)) {
      errors.email = 'Email must be a valid email'
    }

    if (!signupForm.password) {
      errors.password = 'Password is required'
    } else if (signupForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    return errors
  }

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    const errors = validateSignup()
    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors)
      return
    }
    setSignupErrors({})
    setAuthView('success')
  }


  // ─── 🟢 LOG IN STATES, VALIDATION & SUBMIT ───
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  // สเตทสำหรับเก็บ Error ของฝั่ง Log in
  const [loginErrors, setLoginErrors] = useState({})

  const validateLogin = () => {
    const errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // 1. ตรวจสอบรูปแบบ Email ของ Log in
    if (!loginForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(loginForm.email)) {
      errors.email = 'Email must be a valid email'
    }

    // 2. ตรวจสอบรหัสผ่านเบื้องต้น (เช่น ต้องไม่ว่าง หรือต้องมีความยาว 8 ตัวอักษรขึ้นไปตามเงื่อนไขสมัคร)
    if (!loginForm.password) {
      errors.password = 'Password is required'
    } else if (loginForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    return errors
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()

    const errors = validateLogin()
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors)
      return
    }

    setLoginErrors({})

    // หา user จาก email + password ใน mock data
    const matchedUser = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === loginForm.email.trim().toLowerCase() &&
        u.password === loginForm.password
    )

    if (!matchedUser) {
      setLoginErrors({ password: 'Your password is incorrect' })
      toast.error("Your password is incorrect or this email doesn't exist", {
        description: 'Please try another password or email',
        duration: 5000,
        unstyled: true,
        classNames: {
          toast:
            'w-full max-w-[450px] bg-[#e74c3c] text-white flex items-start justify-between p-5 rounded-lg shadow-xl font-sans antialiased relative',
          title: 'text-[15px] font-semibold block mb-0.5 tracking-wide',
          description: 'text-xs text-white/90 font-light block pr-8',
          closeButton: 'absolute top-4 right-4 text-white/80 hover:text-white transition-colors',
        },
        closeButton: true,
      })
      return
    }

    // ส่งข้อมูล user ที่ตรงกับอีเมลเข้า Context (ไม่ใช้ค่า default Somchai ตลอด)
    const { password: _password, ...safeUser } = matchedUser
    login(safeUser)
    toast.success(`Logged in as ${safeUser.name}`)
    navigate('/')
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#fcfbfa] flex items-center justify-center p-4 font-sans antialiased text-[#222222]">
        
        {/* 1. หน้าจอ SIGN UP */}
        {authView === 'signup' && (
          <div className="w-full max-w-[620px] bg-[#f0eee9] rounded-[24px] p-10 md:p-14 shadow-xs relative">
            <h1 className="text-3xl font-bold text-center text-[#222222] mb-10 tracking-tight">Sign up</h1>
            
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1.5">Name</label>
                <input 
                  type="text" 
                  placeholder="Full Name"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none text-[15px] ${signupErrors.name ? 'border-red-400 text-red-500' : 'border-gray-200'}`} 
                />
                {signupErrors.name && <p className="text-xs text-red-500 mt-1.5 font-light">{signupErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1.5">Username</label>
                <input 
                  type="text" 
                  placeholder="Username"
                  value={signupForm.username}
                  onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none text-[15px] ${signupErrors.username ? 'border-red-400 text-red-500' : 'border-gray-200'}`} 
                />
                {signupErrors.username && <p className="text-xs text-red-500 mt-1.5 font-light">{signupErrors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1.5">Email</label>
                <input 
                  type="text" 
                  placeholder="Email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none text-[15px] ${signupErrors.email ? 'border-red-400 text-red-500' : 'border-gray-200'}`} 
                />
                {signupErrors.email && <p className="text-xs text-red-500 mt-1.5 font-light">{signupErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1.5">Password</label>
                <input 
                  type="password" 
                  placeholder="Password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none text-[15px] ${signupErrors.password ? 'border-red-400 text-red-500' : 'border-gray-200'}`} 
                />
                {signupErrors.password && <p className="text-xs text-red-500 mt-1.5 font-light">{signupErrors.password}</p>}
              </div>

              <div className="flex flex-col items-center gap-5 pt-4">
                <button type="submit" className="px-10 py-3.5 bg-[#222220] hover:bg-[#333331] text-white font-medium rounded-full text-sm transition-colors shadow-sm">
                  Sign up
                </button>
                <p className="text-sm text-[#666666] font-light text-center">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="font-semibold text-[#111111] underline hover:text-black transition-colors"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}

        {/* 2. หน้าจอ REGISTRATION SUCCESS */}
        {authView === 'success' && (
          <div className="w-full max-w-[620px] bg-[#f0eee9] rounded-[24px] p-12 md:p-16 shadow-xs text-center relative">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#2ecc71] text-white rounded-full flex items-center justify-center shadow-xs">
                <CheckCircle2 size={36} className="stroke-[2.5]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#222222] mb-8 tracking-tight">Registration success</h1>
            
            <div className="flex justify-center">
              <button onClick={() => setAuthView('login')} className="px-10 py-3.5 bg-[#222220] hover:bg-[#333331] text-white font-medium rounded-full text-sm transition-colors shadow-sm">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* 3. หน้าจอ LOG IN */}
        {authView === 'login' && (
          <div className="w-full max-w-[620px] bg-[#f0eee9] rounded-[24px] p-10 md:p-14 shadow-xs relative">
            <h1 className="text-3xl font-bold text-center text-[#222222] mb-10 tracking-tight">Log in</h1>
            
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1.5">Email</label>
                <input 
                  type="text" 
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
    
                  className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none text-[15px] ${loginErrors.email ? 'border-red-400 text-red-500' : 'border-gray-200 focus:border-gray-400'}`} 
                />
                {loginErrors.email && <p className="text-xs text-red-500 mt-1.5 font-light">{loginErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1.5">Password</label>
                <input 
                  type="password" 
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}

                  className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none text-[15px] ${loginErrors.password ? 'border-red-400 text-red-500' : 'border-gray-200 focus:border-gray-400'}`} 
                />
                {loginErrors.password && <p className="text-xs text-red-500 mt-1.5 font-light">{loginErrors.password}</p>}
              </div>

              <div className="flex flex-col items-center gap-5 pt-4">
                <button type="submit" className="px-12 py-3.5 bg-[#222220] hover:bg-[#333331] text-white font-medium rounded-full text-sm transition-colors shadow-sm">
                  Log in
                </button>
                <p className="text-sm text-[#666666] font-light text-center">
                  Don't have any account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('signup')}
                    className="font-semibold text-[#111111] underline hover:text-black transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}

      </div>
      <Footer />
    </>
  )
}