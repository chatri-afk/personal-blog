import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Nav, Footer } from '../components/WebSection.jsx'
import { AdminSidebar } from '../components/AdminSidebar.jsx'
import { useCategories } from '../components/CategoriesContext'
import { X } from 'lucide-react'

export default function CreateCategoryPage() {
  const navigate = useNavigate()
  const { categoryName } = useParams()
  const isEditMode = Boolean(categoryName)
  const decodedName = categoryName ? decodeURIComponent(categoryName) : ''

  const { categories, addCategory, updateCategory } = useCategories()
  const [name, setName] = useState('')

  useEffect(() => {
    if (isEditMode) {
      setName(decodedName)
    }
  }, [isEditMode, decodedName])

  const showSavedToast = () => {
    toast.custom(
      (t) => (
        <div
          className="flex items-start justify-between bg-[#12b76a] text-white p-4 rounded-xl shadow-lg relative box-border"
          style={{ width: '100%' }}
        >
          <div className="flex flex-col gap-0.5 text-left pr-8">
            <span className="font-semibold text-[15px] tracking-wide whitespace-nowrap">
              {isEditMode ? 'Category updated' : 'Category created'}
            </span>
            <span className="text-sm text-white/90 font-light whitespace-nowrap">
              {isEditMode
                ? 'Your category has been successfully updated'
                : 'Your category has been successfully created'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => toast.dismiss(t)}
            className="absolute right-3 top-3 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      ),
      {
        duration: 4000,
        position: 'bottom-right',
        unstyled: true,
        style: {
          width: '560px',
          maxWidth: 'calc(100vw - 2rem)',
          ['--width']: '560px',
        },
        className: 'article-toast',
      }
    )
  }

  const handleSave = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('Category name is required')
      return
    }

    const duplicate = categories.some(
      (c) =>
        c.toLowerCase() === trimmed.toLowerCase() &&
        (!isEditMode || c.toLowerCase() !== decodedName.toLowerCase())
    )
    if (duplicate) {
      toast.error('This category name already exists')
      return
    }

    if (isEditMode) {
      updateCategory(decodedName, trimmed)
    } else {
      addCategory(trimmed)
    }

    showSavedToast()
    navigate('/admin/category')
  }

  return (
    <>
      <Nav />
      <div className="flex min-h-screen bg-[#f7f6f4] text-[#333333] font-sans">
        <AdminSidebar />

        <main className="flex-1 flex flex-col bg-white">
          <header className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-[#222222]">
              {isEditMode ? 'Edit category' : 'Create category'}
            </h1>

            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-2.5 bg-[#222220] hover:bg-[#333331] text-white text-sm font-medium rounded-full transition-colors shadow-sm"
            >
              Save
            </button>
          </header>

          <section className="p-10 flex flex-col gap-6 bg-[#faf9f6] flex-1">
            <form onSubmit={handleSave} className="flex flex-col gap-2 max-w-md">
              <label htmlFor="category-name" className="text-sm font-medium text-gray-600">
                Category name
              </label>
              <input
                id="category-name"
                type="text"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm placeholder-gray-400 text-[#222222]"
              />
            </form>
          </section>
        </main>
      </div>
      <Footer />
    </>
  )
}
