import { motion } from 'framer-motion'
import { Sparkles, AlertTriangle, Heart, Star } from 'lucide-react'
import { KeyMoment } from '@/types'
import styles from './KeyMomentsCard.module.css'

interface KeyMomentsCardProps {
    moments: KeyMoment[]
}

const typeConfig = {
    highlight: { icon: Star, color: '#FEE500', label: '하이라이트' },
    conflict: { icon: AlertTriangle, color: '#EF4444', label: '갈등' },
    resolution: { icon: Heart, color: '#22C55E', label: '화해' },
    turning_point: { icon: Sparkles, color: '#8B5CF6', label: '터닝포인트' },
}

export default function KeyMomentsCard({ moments }: KeyMomentsCardProps) {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <Sparkles size={20} />
                핵심 순간
            </h3>

            <div className={styles.timeline}>
                {moments.map((moment, index) => {
                    const config = typeConfig[moment.type]
                    const Icon = config.icon

                    return (
                        <motion.div
                            key={index}
                            className={styles.moment}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div
                                className={styles.momentIcon}
                                style={{ backgroundColor: `${config.color}20`, color: config.color }}
                            >
                                <Icon size={18} />
                            </div>

                            <div className={styles.momentContent}>
                                <div className={styles.momentHeader}>
                                    <span
                                        className={styles.momentType}
                                        style={{ color: config.color }}
                                    >
                                        {config.label}
                                    </span>
                                    <span className={styles.momentPeriod}>{moment.period}</span>
                                </div>

                                <p className={styles.momentDescription}>{moment.description}</p>

                                {moment.quote && (
                                    <blockquote className={styles.momentQuote}>
                                        "{moment.quote}"
                                    </blockquote>
                                )}

                                <div className={styles.impactBar}>
                                    <span>영향력</span>
                                    <div className={styles.impactTrack}>
                                        <motion.div
                                            className={styles.impactFill}
                                            style={{ backgroundColor: config.color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${moment.impact_score * 10}%` }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                        />
                                    </div>
                                    <span>{moment.impact_score}/10</span>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
