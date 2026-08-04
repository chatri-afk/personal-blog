import { createContext, useContext, useState, useCallback } from 'react'
import { fetchAllPosts, mapPostForAdmin } from '../../lib/postsApi'

const ArticlesContext = createContext(null)

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  const loadArticles = useCallback(async () => {
    try {
      const posts = await fetchAllPosts()
      setArticles((prev) => {
        const localOnly = prev.filter((a) => a.isLocal)
        const fromApi = posts.map(mapPostForAdmin)
        // คง status / บทความที่แก้ในเครื่องไว้ทับ API
        const overrides = new Map(prev.filter((a) => !a.isLocal).map((a) => [String(a.id), a]))
        const merged = fromApi.map((post) => {
          const local = overrides.get(String(post.id))
          return local ? { ...post, ...local, id: post.id } : post
        })
        return [...localOnly, ...merged]
      })
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const upsertArticle = useCallback((article) => {
    setArticles((prev) => {
      const id = article.id
      const exists = prev.some((a) => String(a.id) === String(id))
      if (exists) {
        return prev.map((a) => (String(a.id) === String(id) ? { ...a, ...article } : a))
      }
      return [{ ...article, isLocal: true }, ...prev]
    })
  }, [])

  const deleteArticle = useCallback((id) => {
    setArticles((prev) => prev.filter((a) => String(a.id) !== String(id)))
  }, [])

  return (
    <ArticlesContext.Provider
      value={{ articles, setArticles, isLoaded, loadArticles, upsertArticle, deleteArticle }}
    >
      {children}
    </ArticlesContext.Provider>
  )
}

export function useArticles() {
  const context = useContext(ArticlesContext)
  if (!context) {
    throw new Error('useArticles must be used within an ArticlesProvider')
  }
  return context
}
