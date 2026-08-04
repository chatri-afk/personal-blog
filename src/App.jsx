import './App.css'
import LandingPage from './assets/pages/LandingPage.jsx'
import ViewPage from './assets/pages/ViewPostPage.jsx'
import NotFoundPage from './assets/pages/NotFoundPage.jsx'
import SignUpLoginPage from './assets/pages/AuthPage.jsx'
import MemberPage from './assets/pages/MemberPage.jsx'
import AdminPage from './assets/pages/AdminPage.jsx'
import CreateArticlePage from './assets/pages/CreateArticlePage.jsx'
import CategoryPage from './assets/pages/CategoryPage.jsx'
import CreateCategoryPage from './assets/pages/CreateCategoryPage.jsx'
import AdminProfilePage from './assets/pages/AdminProfilePage.jsx'
import AdminNotificationPage from './assets/pages/AdminNotificationPage.jsx'
import AdminPagePassword from './assets/pages/AdminPagePassword.jsx'
import { AuthProvider } from './assets/components/AuthContext.jsx'
import { ArticlesProvider } from './assets/components/ArticlesContext.jsx'
import { CategoriesProvider } from './assets/components/CategoriesContext.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <AuthProvider>
      <ArticlesProvider>
        <CategoriesProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/post/:id" element={<ViewPage />} />
              <Route path="/signup" element={<SignUpLoginPage />} />
              <Route path="/login" element={<SignUpLoginPage />} />
              <Route path="/member" element={<MemberPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/create-article" element={<CreateArticlePage />} />
              <Route path="/admin/edit-article/:postId" element={<CreateArticlePage />} />
              <Route path="/admin/category" element={<CategoryPage />} />
              <Route path="/admin/create-category" element={<CreateCategoryPage />} />
              <Route path="/admin/edit-category/:categoryName" element={<CreateCategoryPage />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />
              <Route path="/admin/notification" element={<AdminNotificationPage />} />
              <Route path="/admin/reset-password" element={<AdminPagePassword />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
          <Toaster />
        </CategoriesProvider>
      </ArticlesProvider>
    </AuthProvider>
  )
}

export default App
