import { motion } from 'framer-motion'
import {
    BarChart3,
    MessageCircle,
    Clock,
    Smile,
    Image,
    Link,
    Calendar
} from 'lucide-react'
import { ConversationStatistics } from '@/types'
import styles from './StatisticsCard.module.css'

interface StatisticsCardProps {
    statistics: ConversationStatistics
}

export default function StatisticsCard({ statistics }: StatisticsCardProps) {
    const stats = [
        {
            icon: MessageCircle,
            label: '총 메시지',
            value: statistics.total_messages.toLocaleString(),
            color: '#FEE500'
        },
        {
            icon: Clock,
            label: '평균 응답시간',
            value: `${statistics.avg_response_time_minutes}분`,
            color: '#3B82F6'
        },
        {
            icon: Calendar,
            label: '일평균 메시지',
            value: statistics.daily_average_messages.toFixed(1),
            color: '#8B5CF6'
        },
        {
            icon: Smile,
            label: '이모티콘',
            value: statistics.emoji_count.toLocaleString(),
            color: '#F59E0B'
        },
        {
            icon: Image,
            label: '사진/미디어',
            value: statistics.photo_count.toLocaleString(),
            color: '#22C55E'
        },
        {
            icon: Link,
            label: '링크',
            value: statistics.link_count.toLocaleString(),
            color: '#EC4899'
        },
    ]

    const myRatio = Math.round((statistics.my_messages / statistics.total_messages) * 100)
    const partnerRatio = 100 - myRatio

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <BarChart3 size={20} />
                대화 통계
            </h3>

            {/* Message Ratio Bar */}
            <div className={styles.ratioSection}>
                <div className={styles.ratioLabels}>
                    <span>나 {myRatio}%</span>
                    <span>상대방 {partnerRatio}%</span>
                </div>
                <div className={styles.ratioBar}>
                    <motion.div
                        className={styles.ratioMy}
                        initial={{ width: 0 }}
                        animate={{ width: `${myRatio}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />
                    <motion.div
                        className={styles.ratioPartner}
                        initial={{ width: 0 }}
                        animate={{ width: `${partnerRatio}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    />
                </div>
                <div className={styles.ratioValues}>
                    <span>{statistics.my_messages.toLocaleString()}개</span>
                    <span>{(statistics.total_messages - statistics.my_messages).toLocaleString()}개</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={styles.statItem}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                    >
                        <div
                            className={styles.statIcon}
                            style={{ color: stat.color, backgroundColor: `${stat.color}20` }}
                        >
                            <stat.icon size={18} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>{stat.value}</span>
                            <span className={styles.statLabel}>{stat.label}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Most Active Hour */}
            <div className={styles.activeHour}>
                <span>가장 활발한 시간대:</span>
                <strong>{statistics.most_active_hour}시</strong>
            </div>
        </div>
    )
}
