import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useArticles } from './ArticlesContext'

const CategoriesContext = createContext(null)

const DEFAULT_CATEGORIES = ['Cat', 'General', 'Inspiration']

export function CategoriesProvider({ children }) {
  const { articles, isLoaded } = useArticles()
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!isLoaded && articles.length === 0) return

    const fromArticles = [...new Set(articles.map((item) => item.category).filter(Boolean))]
    setCategories((prev) => {
      if (!initialized) {
        const base = fromArticles.length > 0 ? fromArticles : DEFAULT_CATEGORIES
        setInitialized(true)
        return base
      }
      // รวม category ใหม่จาก articles โดยไม่ทับรายการที่ผู้ใช้สร้าง/แก้เอง
      const merged = [...prev]
      fromArticles.forEach((cat) => {
        if (!merged.some((c) => c.toLowerCase() === cat.toLowerCase())) {
          merged.push(cat)
        }
      })
      return merged
    })
  }, [articles, isLoaded, initialized])

  const addCategory = useCallback((name) => {
    const trimmed = name.trim()
    if (!trimmed) return false
    setCategories((prev) => {
      if (prev.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return prev
      return [...prev, trimmed]
    })
    return true
  }, [])

  const updateCategory = useCallback((oldName, newName) => {
    const trimmed = newName.trim()
    if (!trimmed) return false
    setCategories((prev) =>
      prev.map((c) => (c === oldName ? trimmed : c))
    )
    return true
  }, [])

  const deleteCategory = useCallback((name) => {
    setCategories((prev) => prev.filter((c) => c !== name))
  }, [])

  return (
    <CategoriesContext.Provider
      value={{ categories, addCategory, updateCategory, deleteCategory }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider')
  }
  return context
}
