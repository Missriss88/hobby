import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Heart,
    Users,
    TrendingUp,
    MessageSquare,
    Lightbulb,
    Download
} from 'lucide-react'
import { useAnalysisStore } from '@/stores/analysisStore'
import SentimentChart from '@/components/charts/SentimentChart'
import RadarChart from '@/components/charts/RadarChart'
import KeyMomentsCard from '@/components/analysis/KeyMomentsCard'
import StatisticsCard from '@/components/analysis/StatisticsCard'
import styles from './AnalysisPage.module.css'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
}

export default function AnalysisPage() {
    const navigate = useNavigate()
    const { currentAnalysis } = useAnalysisStore()

    useEffect(() => {
        if (!currentAnalysis) {
            navigate('/')
        }
    }, [currentAnalysis, navigate])

    if (!currentAnalysis) {
        return null
    }

    const {
        partner_name,
        my_name,
        my_sentiment_score,
        partner_sentiment_score,
        my_sentiment_desc,
        partner_sentiment_desc,
        relationship_change,
        sentiment_graph,
        communication_style,
        topics,
        advice,
        summary,
        keywords,
        advanced_analysis
    } = currentAnalysis

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Header */}
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <button onClick={() => navigate('/')} className={styles.backButton}>
                        <ArrowLeft size={20} />
                        <span>새 분석</span>
                    </button>

                    <div className={styles.headerInfo}>
                        <h1>
                            <span className={styles.name}>{my_name || '나'}</span>
                            <span className={styles.and}>&</span>
                            <span className={styles.name}>{partner_name}</span>
                        </h1>
                        <p>대화 분석 결과</p>
                    </div>

                    <button className={styles.downloadButton}>
                        <Download size={18} />
                        <span>내보내기</span>
                    </button>
                </motion.div>

                {/* Summary Card */}
                <motion.div
                    className={styles.summaryCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2>📝 분석 요약</h2>
                    <p>{summary}</p>
                    {keywords && keywords.length > 0 && (
                        <div className={styles.keywords}>
                            {keywords.map((keyword, i) => (
                                <span key={i} className={styles.keyword}>#{keyword}</span>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Dashboard Grid */}
                <motion.div
                    className={styles.dashboard}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Sentiment Scores */}
                    <motion.div className={`${styles.card} ${styles.sentimentCard}`} variants={itemVariants}>
                        <h3><Heart size={20} /> 호감도 분석</h3>
                        <div className={styles.sentimentScores}>
                            <div className={styles.scoreBlock}>
                                <div className={styles.scoreCircle}>
                                    <svg viewBox="0 0 100 100">
                                        <circle
                                            cx="50" cy="50" r="45"
                                            fill="none"
                                            stroke="var(--color-bg-tertiary)"
                                            strokeWidth="8"
                                        />
                                        <motion.circle
                                            cx="50" cy="50" r="45"
                                            fill="none"
                                            stroke="var(--color-primary)"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${my_sentiment_score * 2.83} 283`}
                                            transform="rotate(-90 50 50)"
                                            initial={{ strokeDasharray: "0 283" }}
                                            animate={{ strokeDasharray: `${my_sentiment_score * 2.83} 283` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        />
                                    </svg>
                                    <span className={styles.scoreValue}>{my_sentiment_score}</span>
                                </div>
                                <h4>나의 호감도</h4>
                                <p>{my_sentiment_desc}</p>
                            </div>

                            <div className={styles.scoreBlock}>
                                <div className={styles.scoreCircle}>
                                    <svg viewBox="0 0 100 100">
                                        <circle
                                            cx="50" cy="50" r="45"
                                            fill="none"
                                            stroke="var(--color-bg-tertiary)"
                                            strokeWidth="8"
                                        />
                                        <motion.circle
                                            cx="50" cy="50" r="45"
                                            fill="none"
                                            stroke="var(--color-success)"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${partner_sentiment_score * 2.83} 283`}
                                            transform="rotate(-90 50 50)"
                                            initial={{ strokeDasharray: "0 283" }}
                                            animate={{ strokeDasharray: `${partner_sentiment_score * 2.83} 283` }}
                                            transition={{ duration: 1, delay: 0.7 }}
                                        />
                                    </svg>
                                    <span className={styles.scoreValue}>{partner_sentiment_score}</span>
                                </div>
                                <h4>{partner_name}의 호감도</h4>
                                <p>{partner_sentiment_desc}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Relationship Change */}
                    <motion.div className={`${styles.card} ${styles.relationshipCard}`} variants={itemVariants}>
                        <h3><TrendingUp size={20} /> 관계 변화</h3>
                        <p className={styles.relationshipText}>{relationship_change}</p>
                    </motion.div>

                    {/* Sentiment Timeline */}
                    <motion.div className={`${styles.card} ${styles.chartCard}`} variants={itemVariants}>
                        <h3><TrendingUp size={20} /> 감정 흐름</h3>
                        <div className={styles.chartContainer}>
                            <SentimentChart data={sentiment_graph} />
                        </div>
                    </motion.div>

                    {/* Communication Style Radar */}
                    <motion.div className={`${styles.card} ${styles.radarCard}`} variants={itemVariants}>
                        <h3><MessageSquare size={20} /> 대화 스타일</h3>
                        <div className={styles.chartContainer}>
                            <RadarChart data={communication_style} />
                        </div>
                    </motion.div>

                    {/* Topics */}
                    <motion.div className={`${styles.card} ${styles.topicsCard}`} variants={itemVariants}>
                        <h3><Users size={20} /> 주요 대화 주제</h3>
                        <div className={styles.topics}>
                            {topics.map((topic, i) => (
                                <motion.span
                                    key={i}
                                    className={styles.topic}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                >
                                    {topic}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Advice */}
                    <motion.div className={`${styles.card} ${styles.adviceCard}`} variants={itemVariants}>
                        <h3><Lightbulb size={20} /> AI 조언</h3>
                        <p className={styles.adviceText}>{advice}</p>
                    </motion.div>

                    {/* Advanced Analysis Cards */}
                    {advanced_analysis && (
                        <>
                            <motion.div className={`${styles.card} ${styles.fullWidth}`} variants={itemVariants}>
                                <StatisticsCard statistics={advanced_analysis.statistics} />
                            </motion.div>

                            {advanced_analysis.key_moments && advanced_analysis.key_moments.length > 0 && (
                                <motion.div className={`${styles.card} ${styles.fullWidth}`} variants={itemVariants}>
                                    <KeyMomentsCard moments={advanced_analysis.key_moments} />
                                </motion.div>
                            )}
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
