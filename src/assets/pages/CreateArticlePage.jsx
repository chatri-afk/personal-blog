import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../components/AuthContext'
import { useArticles } from '../components/ArticlesContext'
import { Nav, Footer } from '../components/WebSection.jsx'
import { AdminSidebar } from '../components/AdminSidebar.jsx'
import { fetchAllPosts } from '../../lib/postsApi'
import {
  ChevronDown,
  Image as ImageIcon,
  Trash2,
  X,
} from 'lucide-react'

export default function CreateArticle() {
  const { user } = useAuth()
  const { articles, upsertArticle, deleteArticle } = useArticles()
  const navigate = useNavigate()
  const { postId } = useParams()
  const isEditMode = Boolean(postId)

  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [content, setContent] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [authorName, setAuthorName] = useState('')
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (!isEditMode) {
      setAuthorName(user?.name || 'Thompson P.')
      return
    }

    const loadArticle = async () => {
      try {
        setIsLoading(true)

        const fromContext = articles.find((item) => String(item.id) === String(postId))
        if (fromContext) {
          setCategory(fromContext.category || '')
          setTitle(fromContext.title || '')
          setIntroduction((fromContext.description || fromContext.introduction || '').slice(0, 120))
          setContent(fromContext.content || '')
          setThumbnail(fromContext.image || fromContext.thumbnail || null)
          setAuthorName(fromContext.author || user?.name || 'Thompson P.')
          setIsLoading(false)
          return
        }

        const posts = await fetchAllPosts()
        const post = posts.find((item) => Number(item.id) === Number(postId))

        if (!post) {
          navigate('/admin')
          return
        }

        setCategory(post.category || '')
        setTitle(post.title || '')
        setIntroduction((post.description || '').slice(0, 120))
        setContent(post.content || '')
        setThumbnail(post.image || null)
        setAuthorName(post.author || user?.name || 'Thompson P.')
      } catch (error) {
        console.error('Error loading article for edit:', error)
        navigate('/admin')
      } finally {
        setIsLoading(false)
      }
    }

    loadArticle()
  }, [isEditMode, postId, navigate, user?.name, articles])

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbnail(URL.createObjectURL(file))
  }

  const showArticleToast = (title, description) => {
    toast.custom(
      (t) => (
        <div
          className="flex items-start justify-between bg-[#12b76a] text-white p-4 rounded-xl shadow-lg relative box-border"
          style={{ width: '100%' }}
        >
          <div className="flex flex-col gap-0.5 text-left pr-8">
            <span className="font-semibold text-[15px] tracking-wide whitespace-nowrap">{title}</span>
            <span className="text-sm text-white/90 font-light whitespace-nowrap">{description}</span>
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

  const showDraftToast = () => {
    showArticleToast('Create article and saved as draft', 'You can publish article later')
  }

  const showPublishToast = () => {
    showArticleToast(
      'Create article and published',
      'Your article has been successfully published'
    )
  }

  const handleSubmit = (status) => {
    const normalizedStatus = status === 'draft' ? 'Draft' : 'Published'
    const id = postId || `local-${Date.now()}`

    upsertArticle({
      id,
      title: title || 'Untitled',
      category: category || 'General',
      status: normalizedStatus,
      image: thumbnail,
      thumbnail,
      description: introduction,
      introduction,
      content,
      author: authorName,
      isLocal: !postId || String(postId).startsWith('local-'),
    })

    if (status === 'draft') {
      showDraftToast()
    } else {
      showPublishToast()
    }

    navigate('/admin')
  }

  const confirmDelete = () => {
    if (postId) deleteArticle(postId)
    setIsDeleteModalOpen(false)
    navigate('/admin')
  }

  return (
    <>
      <Nav />
      <div className="flex min-h-screen bg-[#f7f6f4] text-[#333333] font-sans relative">
        <AdminSidebar />

        <main className="flex-1 flex flex-col bg-white">
          <header className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-[#222222]">
              {isEditMode ? 'Edit article' : 'Create article'}
            </h1>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                className="px-6 py-2 border border-gray-400 text-sm font-medium rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm text-[#222222]"
              >
                Save as draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(isEditMode ? 'updated' : 'published')}
                className="px-6 py-2 bg-[#222220] hover:bg-[#333331] text-white text-sm font-medium rounded-full transition-colors shadow-sm"
              >
                {isEditMode ? 'Save' : 'Save and publish'}
              </button>
            </div>
          </header>

          <section className="p-10 flex flex-col gap-6 bg-[#faf9f6] flex-1 max-w-4xl">
            {isLoading ? (
              <p className="text-gray-400 text-sm">Loading article...</p>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">Thumbnail image</label>
                  <div className="flex items-center gap-6">
                    <div className="w-[300px] h-[180px] bg-[#eceae4] rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 shadow-inner overflow-hidden">
                      {thumbnail ? (
                        <img src={thumbnail} alt={title || 'Thumbnail'} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={40} strokeWidth={1.2} />
                      )}
                    </div>

                    <label className="px-5 py-2.5 border border-gray-400 text-sm font-medium rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm cursor-pointer text-[#222222]">
                      Upload thumbnail image
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <div className="relative w-80">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm text-gray-600"
                    >
                      <option value="">Select category</option>
                      <option value="Cat">Cat</option>
                      <option value="General">General</option>
                      <option value="Inspiration">Inspiration</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">Author name</label>
                  <input
                    type="text"
                    value={authorName}
                    disabled
                    className="w-80 px-4 py-2.5 bg-[#eceae4]/60 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">Title</label>
                  <input
                    type="text"
                    placeholder="Article title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm placeholder-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">Introduction (max 120 letters)</label>
                  <textarea
                    placeholder="Introduction"
                    rows={3}
                    maxLength={120}
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm resize-none placeholder-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">Content</label>
                  <textarea
                    placeholder="Content"
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 shadow-sm placeholder-gray-400"
                  />
                </div>

                {isEditMode && (
                  <div className="pt-4 border-t border-gray-200/40">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 font-medium transition-colors group"
                    >
                      <Trash2 size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                      <span className="underline decoration-1 underline-offset-2">Delete article</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-[#faf9f7] w-full max-w-[420px] rounded-[24px] px-8 pt-10 pb-8 shadow-xl border border-gray-100 relative mx-4">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
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
                  onClick={() => setIsDeleteModalOpen(false)}
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
