import { ref, computed } from 'vue'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

interface User {
  id: number
  username: string
  email?: string
  phone?: string
  role?: string
}

const token = ref<string | null>(localStorage.getItem('ytx_token'))
let initialUser: User | null = null
try {
  initialUser = JSON.parse(localStorage.getItem('ytx_user') || 'null')
} catch {
  initialUser = null
}
const user = ref<User | null>(initialUser)
const isLoggedIn = computed(() => !!token.value)

// 初始化：从 localStorage 恢复用户信息
async function initAuth() {
  const savedToken = localStorage.getItem('ytx_token')
  if (!savedToken) {
    return
  }

  token.value = savedToken

  const savedUser = localStorage.getItem('ytx_user')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
    } catch {
      user.value = null
    }
  }

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${savedToken}` }
    })
    const data = await res.json()
    if (data.success) {
      user.value = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role || 'user',
      }
      localStorage.setItem('ytx_user', JSON.stringify(user.value))
    } else {
      logout()
    }
  } catch {
    // 后端不可用时不强制登出，保留 token
  }
}

function setAuth(newToken: string, newUser: User) {
  token.value = newToken
  user.value = newUser
  localStorage.setItem('ytx_token', newToken)
  localStorage.setItem('ytx_user', JSON.stringify(newUser))
}

function logout() {
  token.value = null
  user.value = null
  localStorage.removeItem('ytx_token')
  localStorage.removeItem('ytx_user')
}

function getAuthHeaders() {
  return token.value ? { Authorization: `Bearer ${token.value}` } : {}
}

export function useAuth() {
  return {
    token,
    user,
    isLoggedIn,
    initAuth,
    setAuth,
    logout,
    getAuthHeaders,
    API_BASE,
  }
}
