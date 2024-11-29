import { Dispatch, SetStateAction } from 'react'
import { create } from 'zustand'

interface SuggestLoadingState {
  isSuggestLoading: boolean
  setIsSuggestLoading: Dispatch<SetStateAction<boolean>>
}

export const useIsSuggestLoading = create<SuggestLoadingState>((set) => ({
  isSuggestLoading: false,
  setIsSuggestLoading: (value) =>
    set((state) => ({
      isSuggestLoading:
        typeof value === 'function' ? value(state.isSuggestLoading) : value,
    })),
}))
