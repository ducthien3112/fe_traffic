import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBrain, FaHome, FaChartBar } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'
import api from '../services/api'

const Layout = () => {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const [testCategories, setTestCategories] = useState([])
  const [scrolled, setScrolled] = useState(false)

  // Track scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch test categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/tests?all=true')
        const tests = response.data.tests || []
        
        // Get unique types (excluding iq, eq which have their own buttons)
        const types = [...new Set(tests.filter(t => t.isActive).map(t => t.type))]
          .filter(t => !['iq', 'eq'].includes(t.toLowerCase()))
        
        setTestCategories(types)
      } catch (error) {
        console.error('Error fetching test categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Type label and icon helper
  const getTypeConfig = (type) => {
    const config = {
      'toan': { label: 'Toán học', icon: '📐' },
      'ly': { label: 'Vật lý', icon: '⚡' },
      'hoa': { label: 'Hóa học', icon: '🧪' },
      'sinh': { label: 'Sinh học', icon: '🧬' },
      'anh': { label: 'Tiếng Anh', icon: '🔤' },
      'su': { label: 'Lịch sử', icon: '📜' },
      'dia': { label: 'Địa lý', icon: '🌍' },
      'van': { label: 'Ngữ văn', icon: '📖' },
      'gdcd': { label: 'GDCD', icon: '⚖️' },
      'mbti': { label: 'MBTI', icon: '🧠' },
    }
    return config[type?.toLowerCase()] || { label: type?.toUpperCase(), icon: '📋' }
  }

  return (
    <div className="relative z-10">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.img
                src="/logonghien_hoc.png"
                alt="Nghiền Học"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="h-12 w-auto"
              />
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-xl font-bold font-display gradient-text leading-tight">
                  <span className="block sm:inline">Nghiền</span>
                  <span className="block sm:inline"> Học</span>
                </span>
                <span className="text-xs text-slate-400 hidden sm:block">Online Quiz Learning</span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                to="/"
                className={`h-10 px-3 sm:px-4 rounded-lg flex items-center space-x-2 transition-all duration-300 border
                           ${isHome 
                             ? 'bg-white/10 text-white border-white/20' 
                             : 'text-slate-400 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <FaHome />
                <span className="hidden sm:inline">Trang chủ</span>
              </Link>
              <Link
                to="/tests/iq"
                className="h-10 px-3 sm:px-4 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 
                           transition-all duration-300 flex items-center space-x-2 border border-white/10 hover:border-white/20"
              >
                <span>🧠</span>
                <span className="hidden sm:inline">IQ Test</span>
              </Link>
              <Link
                to="/tests/eq"
                className="h-10 px-3 sm:px-4 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 
                           transition-all duration-300 flex items-center space-x-2 border border-white/10 hover:border-white/20"
              >
                <span>💖</span>
                <span className="hidden sm:inline">EQ Test</span>
              </Link>
              
              {/* Dropdown for other tests */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`h-10 px-3 sm:px-4 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 
                             transition-all duration-300 flex items-center space-x-2 border ${
                               showDropdown ? 'bg-white/10 text-white border-white/20' : 'border-white/10 hover:border-white/20'
                             }`}
                >
                  <span>📋</span>
                  <span className="hidden sm:inline">Bài Thi Khác</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl rounded-xl 
                                 border border-white/10 shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-2">
                        {/* Fixed items */}
                        <Link
                          to="/mbti"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 
                                     transition-all bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-1"
                        >
                          <span>🧠</span>
                          <span>Trắc nghiệm MBTI</span>
                          <span className="ml-auto text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">HOT</span>
                        </Link>
                        
                        <Link
                          to="/assessment"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 
                                     transition-all bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-1"
                        >
                          <span>🎯</span>
                          <span>Đánh Giá Năng Lực</span>
                          <span className="ml-auto text-xs bg-cyan-500 text-white px-2 py-0.5 rounded-full">50 đề</span>
                        </Link>

                        <Link
                          to="/grades"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 
                                     transition-all bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-2"
                        >
                          <span>📚</span>
                          <span>Bài Thi Học Đường</span>
                        </Link>

                        {/* Dynamic categories from database */}
                        {testCategories.length > 0 && (
                          <>
                            <div className="border-t border-white/10 pt-2 mt-1 mb-1">
                              <span className="px-4 text-xs text-white/40 uppercase tracking-wider">Danh mục khác</span>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {testCategories.map(type => {
                                const config = getTypeConfig(type)
                                return (
                                  <Link
                                    key={type}
                                    to={`/categories/${type}`}
                                    onClick={() => setShowDropdown(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/80 
                                               hover:bg-white/10 hover:text-white transition-all"
                                  >
                                    <span>{config.icon}</span>
                                    <span>{config.label}</span>
                                  </Link>
                                )
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img
                src="/logonghien_hoc.png"
                alt="Nghiền Học"
                className="h-8 w-auto"
              />
              <span className="text-slate-400 text-sm">
                © 2026 Nghiền Học. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Điều khoản</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Bảo mật</Link>
              <a href="mailto:support@nghienhoc.com" className="hover:text-white transition-colors">Liên hệ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
