import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, ChevronRight, Calendar, User } from 'lucide-react'
import { useAnalysisStore } from '@/stores/analysisStore'
import styles from './HistoryPage.module.css'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
}

export default function HistoryPage() {
    const { analysisHistory, removeFromHistory, clearHistory, setCurrentAnalysis } = useAnalysisStore()

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className={styles.page}>
            <div className="container">
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1>분석 기록</h1>
                        <p>이전 분석 결과를 다시 확인할 수 있습니다</p>
                    </div>

                    {analysisHistory.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className={styles.clearButton}
                        >
                            <Trash2 size={16} />
                            전체 삭제
                        </button>
                    )}
                </motion.div>

                {analysisHistory.length === 0 ? (
                    <motion.div
                        className={styles.emptyState}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className={styles.emptyIcon}>📭</div>
                        <h2>아직 분석 기록이 없습니다</h2>
                        <p>카카오톡 대화를 분석하면 여기에 기록이 저장됩니다</p>
                        <Link to="/" className={styles.analyzeButton}>
                            첫 분석 시작하기
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        className={styles.historyList}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {analysisHistory.map((item) => (
                            <motion.div
                                key={item.id}
                                className={styles.historyItem}
                                variants={itemVariants}
                                whileHover={{ x: 4 }}
                            >
                                <Link
                                    to="/analysis"
                                    className={styles.itemContent}
                                    onClick={() => setCurrentAnalysis(item.result)}
                                >
                                    <div className={styles.itemAvatar}>
                                        <User size={24} />
                                    </div>

                                    <div className={styles.itemInfo}>
                                        <h3>{item.partner_name}님과의 대화</h3>
                                        <p className={styles.itemSummary}>{item.summary}</p>
                                        <div className={styles.itemMeta}>
                                            <span>
                                                <Calendar size={14} />
                                                {formatDate(item.date)}
                                            </span>
                                        </div>
                                    </div>

                                    <ChevronRight className={styles.itemArrow} size={20} />
                                </Link>

                                <button
                                    onClick={() => removeFromHistory(item.id)}
                                    className={styles.deleteButton}
                                    title="삭제"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
