import { motion } from 'framer-motion'
import {
    TrendingUp,
    MessageSquare,
    Heart,
    Sparkles,
    BarChart3,
    Zap
} from 'lucide-react'
import FileUploader from '@/components/upload/FileUploader'
import styles from './HomePage.module.css'

const features = [
    {
        icon: Heart,
        title: '감정 분석',
        description: '대화 속 숨겨진 감정과 호감도를 심층 분석합니다'
    },
    {
        icon: TrendingUp,
        title: '관계 변화 추적',
        description: '시간에 따른 관계 발전 추이를 시각화합니다'
    },
    {
        icon: MessageSquare,
        title: '대화 패턴 분석',
        description: '대화 주도권, 응답 패턴, 언어 습관을 파악합니다'
    },
    {
        icon: Sparkles,
        title: '핵심 순간 추출',
        description: '관계의 터닝포인트와 중요 대화를 자동 감지합니다'
    },
    {
        icon: BarChart3,
        title: '상세 통계',
        description: '메시지 수, 응답 시간, 활동 시간대 등을 분석합니다'
    },
    {
        icon: Zap,
        title: 'AI 조언',
        description: '관계 발전을 위한 맞춤형 조언을 제공합니다'
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
}

export default function HomePage() {
    return (
        <div className={styles.page}>
            <div className="container">
                {/* Hero Section */}
                <motion.section
                    className={styles.hero}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className={styles.heroGlow} />

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        카카오톡 대화를{' '}
                        <span className={styles.highlight}>AI로 분석</span>하세요
                    </motion.h1>

                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        대화 내용을 업로드하면 AI가 관계와 감정을 심층 분석하여
                        <br />
                        숨겨진 인사이트를 발견해드립니다
                    </motion.p>
                </motion.section>

                {/* Upload Section */}
                <motion.section
                    className={styles.uploadSection}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <FileUploader />
                </motion.section>

                {/* Features Section */}
                <motion.section
                    className={styles.features}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h2
                        className={styles.sectionTitle}
                        variants={itemVariants}
                    >
                        분석 기능
                    </motion.h2>

                    <div className={styles.featureGrid}>
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className={styles.featureCard}
                                variants={itemVariants}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <div className={styles.featureIcon}>
                                    <feature.icon size={24} />
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* How to Section */}
                <motion.section
                    className={styles.howTo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className={styles.sectionTitle}>사용 방법</h2>

                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>1</div>
                            <h4>대화 내보내기</h4>
                            <p>카카오톡 채팅방에서 "대화 내보내기"를 선택하세요</p>
                        </div>
                        <div className={styles.stepArrow}>→</div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>2</div>
                            <h4>파일 업로드</h4>
                            <p>내보낸 .txt 파일을 위 영역에 드래그하세요</p>
                        </div>
                        <div className={styles.stepArrow}>→</div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>3</div>
                            <h4>분석 결과 확인</h4>
                            <p>AI가 분석한 상세 결과를 확인하세요</p>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    )
}
