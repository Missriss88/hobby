import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AnalysisResult, UploadState, AnalysisHistoryItem } from '@/types'

interface AnalysisStore {
    // State
    currentAnalysis: AnalysisResult | null
    uploadState: UploadState
    analysisHistory: AnalysisHistoryItem[]

    // Actions
    setCurrentAnalysis: (analysis: AnalysisResult | null) => void
    setUploadState: (state: Partial<UploadState>) => void
    addToHistory: (analysis: AnalysisResult) => void
    removeFromHistory: (id: string) => void
    clearHistory: () => void
    reset: () => void
}

const initialUploadState: UploadState = {
    status: 'idle',
    progress: 0,
    error: undefined,
}

export const useAnalysisStore = create<AnalysisStore>()(
    persist(
        (set, get) => ({
            currentAnalysis: null,
            uploadState: initialUploadState,
            analysisHistory: [],

            setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

            setUploadState: (state) => set((prev) => ({
                uploadState: { ...prev.uploadState, ...state }
            })),

            addToHistory: (analysis) => {
                const newItem: AnalysisHistoryItem = {
                    id: Date.now().toString(),
                    date: new Date().toISOString(),
                    partner_name: analysis.partner_name,
                    summary: analysis.summary,
                    result: analysis,
                }
                set((prev) => ({
                    analysisHistory: [newItem, ...prev.analysisHistory].slice(0, 10) // 최근 10개만 유지
                }))
            },

            removeFromHistory: (id) => set((prev) => ({
                analysisHistory: prev.analysisHistory.filter(item => item.id !== id)
            })),

            clearHistory: () => set({ analysisHistory: [] }),

            reset: () => set({
                currentAnalysis: null,
                uploadState: initialUploadState,
            }),
        }),
        {
            name: 'chat-analyzer-storage',
            partialize: (state) => ({ analysisHistory: state.analysisHistory }),
        }
    )
)
