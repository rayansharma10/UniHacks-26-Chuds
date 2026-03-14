import { create } from 'zustand'
import api from '../lib/api'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),

  login: async (username, password) => {
    const { data } = await api.post('/auth/login', new URLSearchParams({ username, password }))
    localStorage.setItem('token', data.access_token)
    set({ token: data.access_token })
    const me = await api.get('/users/me')
    set({ user: me.data })
  },

  register: async (username, email, password) => {
    await api.post('/auth/register', { username, email, password })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
    window.location.href = '/auth'
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/users/me')
      set({ user: data })
    } catch (error) {
      console.log('Token invalid, logging out:', error)
      localStorage.removeItem('token')
      set({ user: null, token: null })
    }
  },
}))
