/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AuthContext = React.createContext(null)

// Base URL จาก .env (ต้อง restart Vite หลังแก้ค่า)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function AuthProvider({ children }) {
  const [state, setState] = useState({
    loading: false,
    getUserLoading: true,
    error: null,
    user: null,
  })

  const navigate = useNavigate()

  // แปลง response จาก backend ให้ frontend ใช้ field เดิมได้ (avatar)
  const normalizeUser = (data) => {
    if (!data) return null
    return {
      ...data,
      avatar: data.avatar || data.profilePic || '',
      role: data.role || 'user',
    }
  }

  // ดึงข้อมูล user ด้วย token ที่เก็บใน localStorage
  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setState((prev) => ({
        ...prev,
        user: null,
        getUserLoading: false,
      }))
      return
    }

    try {
      setState((prev) => ({ ...prev, getUserLoading: true }))
      // สำคัญ: ต้องส่ง Bearer token ไม่เช่นนั้น /auth/get-user จะได้ 401
      const response = await axios.get(`${API_BASE_URL}/auth/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setState((prev) => ({
        ...prev,
        user: normalizeUser(response.data),
        getUserLoading: false,
        error: null,
      }))
    } catch (error) {
      // token หมดอายุ / ไม่ถูกต้อง → ล้างออก
      localStorage.removeItem('token')
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.error || error.message,
        user: null,
        getUserLoading: false,
      }))
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // Login: รับ { email, password } → ได้ access_token → เก็บ token → ดึง user
  const login = async (data) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data)
      const token = response.data.access_token
      localStorage.setItem('token', token)

      setState((prev) => ({ ...prev, loading: false, error: null }))
      await fetchUser()
      navigate('/')
      return { success: true }
    } catch (error) {
      const message =
        error.response?.data?.error || 'Login failed'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }))
      return { error: message }
    }
  }

  // Register: รับ { email, password, username, name }
  // ไม่ navigate เอง — ให้ AuthPage แสดงหน้า success
  const register = async (data) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      await axios.post(`${API_BASE_URL}/auth/register`, data)
      setState((prev) => ({ ...prev, loading: false, error: null }))
      return { success: true }
    } catch (error) {
      const message =
        error.response?.data?.error || 'Registration failed'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }))
      return { error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setState({
      user: null,
      error: null,
      loading: false,
      getUserLoading: false,
    })
    navigate('/')
  }

  // อัปเดต user ใน memory (ใช้หน้า profile ก่อนมี API update)
  const updateUserProfile = (updatedData) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updatedData } : null,
    }))
  }

  // true เมื่อมี user จาก API แล้ว
  const isAuthenticated = Boolean(state.user)
  // alias ให้โค้ดเก่าที่ยังใช้ isLoggedIn / user ตรงๆ ทำงานต่อได้
  const isLoggedIn = isAuthenticated
  const user = state.user

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        isAuthenticated,
        isLoggedIn,
        user,
        updateUserProfile,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
