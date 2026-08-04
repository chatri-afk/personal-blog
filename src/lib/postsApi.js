import axios from 'axios'

export const POSTS_API_URL = 'https://blog-post-project-api.vercel.app/posts'

/**
 * ดึงบทความจาก API กลาง (ใช้ร่วมกันทุกหน้า)
 * @param {{ page?: number, limit?: number, category?: string, keyword?: string }} options
 */
export async function fetchPosts({ page = 1, limit, category, keyword } = {}) {
  const params = {
    page,
    ...(limit && { limit }),
    ...(category && category !== 'highlight' && { category }),
    ...(keyword && { keyword }),
  }

  const response = await axios.get(POSTS_API_URL, { params })
  const data = response.data

  return {
    posts: data.posts || [],
    totalPages: data.totalPages ?? 1,
    totalPosts: data.totalPosts ?? 0,
    currentPage: data.currentPage ?? page,
    nextPage: data.nextPage ?? null,
  }
}

/** ดึงบทความทั้งหมด (วนหน้า) สำหรับ Admin / หน้าที่ต้องใช้ครบชุด */
export async function fetchAllPosts() {
  const first = await fetchPosts({ page: 1, limit: 100 })
  let posts = [...first.posts]
  let page = 2

  while (page <= first.totalPages) {
    const next = await fetchPosts({ page, limit: 100 })
    posts = [...posts, ...next.posts]
    page += 1
  }

  return posts
}

/** แมปโพสต์จาก API ให้ใช้ใน Admin table */
export function mapPostForAdmin(post) {
  return {
    id: post.id,
    title: post.title,
    category: post.category,
    // API สาธารณะเป็นโพสต์ที่เผยแพร่แล้ว
    status: post.status || 'Published',
    image: post.image,
    author: post.author,
    date: post.date,
  }
}
