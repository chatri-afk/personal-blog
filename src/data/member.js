// ข้อมูลสำหรับทดสอบสิทธิ์ Admin
export const mockAdminData = {
  name: 'Moodeng ja',
  username: 'moodeng.cute',
  email: 'moodeng.cute@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=150',
  bio: 'I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.',
  password: 'password123',
  role: 'admin',
}

// ข้อมูลสำหรับทดสอบ Member ทั่วไป
export const mockGeneralUserData = {
  name: 'Somchai Dee',
  username: 'somchai.dev',
  email: 'somchai.dee@gmail.com',
  avatar: '',
  password: 'password123',
  role: 'member',
}

// รายชื่อผู้ใช้ทั้งหมดสำหรับจำลองการล็อกอิน
export const mockUsers = [mockAdminData, mockGeneralUserData]

export default mockGeneralUserData
