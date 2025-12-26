import axios from 'axios'
import { AnalysisResult } from '@/types'

const API_BASE_URL = '/api'

// 파일 분석 API
export async function analyzeChat(file: File): Promise<AnalysisResult> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post<AnalysisResult>(`${API_BASE_URL}/analyze`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    return response.data
}

// 고급 분석 API
export async function analyzeAdvanced(file: File): Promise<AnalysisResult> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post<AnalysisResult>(`${API_BASE_URL}/analyze/advanced`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    return response.data
}

// 분석 검증 API (분석 전 파일 유효성 검사)
export async function validateChatFile(file: File): Promise<{ valid: boolean; message_count?: number; error?: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post(`${API_BASE_URL}/validate`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    return response.data
}
