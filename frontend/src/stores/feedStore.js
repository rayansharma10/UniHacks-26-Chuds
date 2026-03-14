import { create } from 'zustand'

export const useFeedStore = create((set) => ({
  category: 'all',
  setCategory: (category) => set({ category }),
  community: null,
  setCommunity: (community) => set({ community }),
}))
