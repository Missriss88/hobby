import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useAnalysisStore } from '@/stores/analysisStore'
import { analyzeAdvanced } from '@/services/api'
import styles from './FileUploader.module.css'

interface FileUploaderProps {
    onAnalysisComplete?: () => void
}

export default function FileUploader({ onAnalysisComplete }: FileUploaderProps) {
    const navigate = useNavigate()
    const { setCurrentAnalysis, setUploadState, uploadState, addToHistory } = useAnalysisStore()
    const [isDragOver, setIsDragOver] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        const file = e.dataTransfer.files[0]
        if (file && file.name.endsWith('.txt')) {
            setSelectedFile(file)
        } else {
            setUploadState({ status: 'error', error: '카카오톡 내보내기 파일(.txt)만 업로드 가능합니다.' })
        }
    }, [setUploadState])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.name.endsWith('.txt')) {
            setSelectedFile(file)
            setUploadState({ status: 'idle', error: undefined })
        } else if (file) {
            setUploadState({ status: 'error', error: '카카오톡 내보내기 파일(.txt)만 업로드 가능합니다.' })
        }
    }, [setUploadState])

    const handleAnalyze = useCallback(async () => {
        console.log('handleAnalyze started', { selectedFile })
        if (!selectedFile) {
            console.log('No file selected, returning')
            return
        }

        console.log('Setting upload state to uploading')
        setUploadState({ status: 'uploading', progress: 0 })

        try {
            console.log('Simulating upload...')
            // 업로드 진행 시뮬레이션
            setUploadState({ status: 'uploading', progress: 30 })
            await new Promise(resolve => setTimeout(resolve, 300))

            console.log('Calling API...')
            setUploadState({ status: 'analyzing', progress: 60 })

            const result = await analyzeAdvanced(selectedFile)
            console.log('API Result:', result)

            setUploadState({ status: 'complete', progress: 100 })
            setCurrentAnalysis(result)
            addToHistory(result)

            await new Promise(resolve => setTimeout(resolve, 500))

            onAnalysisComplete?.()
            navigate('/analysis')

        } catch (error) {
            console.error('Analysis failed:', error)
            setUploadState({
                status: 'error',
                error: error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.'
            })
        }
    }, [selectedFile, setUploadState, setCurrentAnalysis, addToHistory, navigate, onAnalysisComplete])

    const handleReset = useCallback(() => {
        setSelectedFile(null)
        setUploadState({ status: 'idle', progress: 0, error: undefined })
    }, [setUploadState])

    const renderContent = () => {
        switch (uploadState.status) {
            case 'uploading':
            case 'analyzing':
                return (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={styles.loadingState}
                    >
                        <Loader2 className={styles.spinner} size={48} />
                        <h3>{uploadState.status === 'uploading' ? '업로드 중...' : 'AI 분석 중...'}</h3>
                        <p>잠시만 기다려주세요. 약 10-20초 소요됩니다.</p>
                        <div className={styles.progressBar}>
                            <motion.div
                                className={styles.progressFill}
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadState.progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </motion.div>
                )

            case 'complete':
                return (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={styles.completeState}
                    >
                        <CheckCircle className={styles.successIcon} size={48} />
                        <h3>분석 완료!</h3>
                        <p>결과 페이지로 이동합니다...</p>
                    </motion.div>
                )

            case 'error':
                return (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={styles.errorState}
                    >
                        <AlertCircle className={styles.errorIcon} size={48} />
                        <h3>오류 발생</h3>
                        <p>{uploadState.error}</p>
                        <button onClick={handleReset} className={styles.retryButton}>
                            다시 시도
                        </button>
                    </motion.div>
                )

            default:
                return selectedFile ? (
                    <motion.div
                        key="selected"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={styles.selectedState}
                    >
                        <FileText className={styles.fileIcon} size={48} />
                        <div className={styles.fileInfo}>
                            <h3>{selectedFile.name}</h3>
                            <p>{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <div className={styles.actions}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleReset()
                                }}
                                className={styles.cancelButton}
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    console.log('Analyze button clicked')
                                    handleAnalyze()
                                }}
                                className={styles.analyzeButton}
                            >
                                분석 시작
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.idleState}
                    >
                        <Upload className={styles.uploadIcon} size={48} />
                        <h3>카카오톡 대화 파일 업로드</h3>
                        <p>여기에 파일을 드래그하거나 클릭하여 선택하세요</p>
                        <span className={styles.hint}>.txt 파일만 지원됩니다</span>
                    </motion.div>
                )
        }
    }

    return (
        <div
            className={`${styles.uploader} ${isDragOver ? styles.dragOver : ''} ${uploadState.status === 'error' ? styles.hasError : ''
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
                if (uploadState.status === 'idle' && !selectedFile) {
                    document.getElementById('file-input')?.click()
                }
            }}
        >
            <input
                id="file-input"
                type="file"
                accept=".txt"
                onChange={handleFileSelect}
                className={styles.hiddenInput}
            />

            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>
        </div>
    )
}
