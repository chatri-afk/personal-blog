import { createContext, useState, useContext } from 'react'
import { mockGeneralUserData } from '../../data/member'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // default: ยังไม่ login — Navbar แสดง Log in / Sign up
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // ข้อมูล member ค้างไว้ใน context แม้ยังไม่ login / หลัง logout
  const [user, setUser] = useState(mockGeneralUserData)

// 🆕 ปรับฟังก์ชัน login ให้รับข้อมูล user ที่จะล็อกอินเข้ามา
  const login = (userData) => {
    setIsLoggedIn(true)
    if (userData) {
      setUser(userData) // อัปเดตข้อมูลผู้ใช้ในระบบให้เป็นคนที่ล็อกอินเข้ามาจริงๆ
    }
  }

  const logout = () => {
    setIsLoggedIn(false)
  }

  const updateUserProfile = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }))
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
