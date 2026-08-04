import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useArticles } from '../components/ArticlesContext'
import { Nav, Footer } from '../components/WebSection.jsx'
import { AdminSidebar } from '../components/AdminSidebar.jsx'
import { ChevronDown, Pencil, Trash2, Plus, Search, X } from 'lucide-react'

export default function AdminPage() {
  const { articles, isLoaded, loadArticles, deleteArticle } = useArticles()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isLoading, setIsLoading] = useState(!isLoaded)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await loadArticles()
      setIsLoading(false)
    }
    load()
  }, [loadArticles])

  const categoriesList = useMemo(() => {
    return [...new Set(articles.map((article) => article.category).filter(Boolean))]
  }, [articles])

  const statusesList = useMemo(() => {
    return [...new Set(articles.map((article) => article.status).filter(Boolean))]
  }, [articles])

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === '' || article.status === selectedStatus
      const matchesCategory = selectedCategory === '' || article.category === selectedCategory
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [searchTerm, selectedStatus, selectedCategory, articles])

  const openDeleteModal = (article) => {
    setArticleToDelete(article)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setArticleToDelete(null)
  }

  const confirmDelete = () => {
    if (articleToDelete) {
      deleteArticle(articleToDelete.id)
    }
    closeDeleteModal()
  }

  return (
    <>
    <Nav />
    <div className="flex min-h-screen bg-[#f7f6f4] text-[#333333] font-sans">
      <AdminSidebar />

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col bg-white">
        
        {/* Top Header Row */}
        <header className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-[#222222]">Article management</h1>

          <Link to="/admin/create-article" className="flex items-center gap-2 bg-[#222220] hover:bg-[#333331] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm">
            <Plus size={16} />
            <span>Create article</span>
          </Link>
        </header>

        {/* Content Area */}
        <section className="p-10 flex flex-col gap-6 bg-[#faf9f6] flex-1">
          
          {/* Filters Row */}
          <div className="flex items-center justify-between gap-4">
            {/* 🛠️ 1. Search Input ที่ใช้งานได้จริง */}
            <div className="relative w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm"
              />
            </div>

            {/* Dropdown Selects */}
            <div className="flex items-center gap-3">
              {/* 🛠️ 2. Status Dropdown ที่ใช้งานได้จริง */}
              <div className="relative">
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm min-w-[120px] text-gray-600"
                >
                  <option value="">All Status</option>
                  {statusesList.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* 🛠️ 3. Category Dropdown ที่ใช้งานได้จริง */}
              <div className="relative">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm min-w-[130px] text-gray-600"
                >
                  <option value="">All Category</option>
                  {categoriesList.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ================= ARTICLES TABLE ================= */}
          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-white text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium text-gray-500 normal-case text-sm">Article title</th>
                  <th className="px-6 py-4 font-medium text-gray-500 normal-case text-sm w-32">Category</th>
                  <th className="px-6 py-4 font-medium text-gray-500 normal-case text-sm w-32">Status</th>
                  <th className="px-6 py-4 w-28"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/70 text-sm text-[#333333]">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-400">
                      Loading articles...
                    </td>
                  </tr>
                ) : filteredArticles.length > 0 ? (
                  filteredArticles.map((article, index) => (
                    <tr 
                      key={article.id} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#faf9f6]/60'} hover:bg-gray-50/80 transition-colors`}
                    >
                      <td className="px-6 py-4.5 font-medium text-[#222222] max-w-md truncate">
                        {article.title}
                      </td>
                      <td className="px-6 py-4.5 text-gray-600">
                        {article.category}
                      </td>
                      <td className="px-6 py-4.5">
                        {/* ============ ตอนนี้ตัว draft ยังไม่เป็นการใช้ api แต่เป็นการ hard code ในการแสดงผล ============ */}
                        {article.status === 'Draft' ? (
                          <div className="flex items-center gap-1.5 text-[#b45309] font-medium">
                            <span className="w-1.5 h-1.5 bg-[#b45309] rounded-full"></span>
                            Draft
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#2ecc71] font-medium">
                            <span className="w-1.5 h-1.5 bg-[#2ecc71] rounded-full"></span>
                            {article.status}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="flex items-center justify-end gap-4 text-gray-400">
                          <Link
                            to={`/admin/edit-article/${article.id}`}
                            className="hover:text-gray-600 transition-colors"
                            aria-label={`Edit ${article.title}`}
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(article)}
                            className="hover:text-red-500 transition-colors"
                            aria-label={`Delete ${article.title}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-400">
                      No articles found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>
      </main>

    </div>
    {isDeleteModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
        <div className="bg-[#faf9f7] w-full max-w-[420px] rounded-[24px] px-8 pt-10 pb-8 shadow-xl border border-gray-100 relative mx-4">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>

          <div className="flex flex-col items-center text-center gap-5">
            <h3 className="text-[22px] font-bold text-[#222220] tracking-tight">Delete article</h3>
            <p className="text-[#666461] text-sm font-medium">Do you want to delete this article?</p>
            <div className="flex items-center justify-center gap-3 w-full max-w-[300px]">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="flex-1 py-2.5 border border-[#c2bebe] text-sm font-semibold rounded-full bg-white hover:bg-gray-50 transition-colors text-[#222220]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-[#22221e] hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    <Footer />
    </>
  )
}