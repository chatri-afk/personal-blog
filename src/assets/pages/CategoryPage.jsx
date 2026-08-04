import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useArticles } from '../components/ArticlesContext'
import { useCategories } from '../components/CategoriesContext'
import { Nav, Footer } from '../components/WebSection.jsx'
import { AdminSidebar } from '../components/AdminSidebar.jsx'
import { Pencil, Trash2, Plus, Search, X } from 'lucide-react'

export default function CategoryPage() {
  const { isLoaded, loadArticles } = useArticles()
  const { categories, deleteCategory } = useCategories()

  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(!isLoaded)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      if (loadArticles) {
        await loadArticles()
      }
      setIsLoading(false)
    }
    load()
  }, [loadArticles])

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, categories])

  const openDeleteModal = (category) => {
    setCategoryToDelete(category)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setCategoryToDelete(null)
  }

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete)
    }
    closeDeleteModal()
  }

  return (
    <>
      <Nav />
      <div className="flex min-h-screen bg-[#f7f6f4] text-[#333333] font-sans">
        <AdminSidebar />

        <main className="flex-1 flex flex-col bg-white">
          <header className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-[#222222]">Category management</h1>

            <Link
              to="/admin/create-category"
              className="flex items-center gap-2 bg-[#222220] hover:bg-[#333331] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Create category</span>
            </Link>
          </header>

          <section className="p-10 flex flex-col gap-6 bg-[#faf9f6] flex-1">
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm placeholder-gray-400"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-white text-gray-500 text-xs font-semibold tracking-wider">
                    <th className="px-6 py-4 font-medium text-gray-500 normal-case text-sm">Category</th>
                    <th className="px-6 py-4 w-28"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/70 text-sm text-[#333333]">
                  {isLoading ? (
                    <tr>
                      <td colSpan="2" className="text-center py-10 text-gray-400">
                        Loading categories...
                      </td>
                    </tr>
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => (
                      <tr
                        key={category}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#faf9f6]/60'} hover:bg-gray-50/80 transition-colors`}
                      >
                        <td className="px-6 py-4.5 font-medium text-[#222222]">{category}</td>
                        <td className="px-6 py-4.5">
                          <div className="flex items-center justify-end gap-4 text-gray-400">
                            <Link
                              to={`/admin/edit-category/${encodeURIComponent(category)}`}
                              className="hover:text-gray-600 transition-colors"
                              aria-label={`Edit ${category}`}
                            >
                              <Pencil size={16} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => openDeleteModal(category)}
                              className="hover:text-red-500 transition-colors"
                              aria-label={`Delete ${category}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-10 text-gray-400">
                        No categories found.
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
              <h3 className="text-[22px] font-bold text-[#222220] tracking-tight">Delete category</h3>
              <p className="text-[#666461] text-sm font-medium">Do you want to delete this category?</p>

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
