import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, History, Home } from 'lucide-react'
import styles from './Layout.module.css'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation()

    const navItems = [
        { path: '/', icon: Home, label: '홈' },
        { path: '/history', icon: History, label: '기록' },
    ]

    return (
        <div className={styles.layout}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link to="/" className={styles.logo}>
                        <MessageCircle className={styles.logoIcon} />
                        <span className={styles.logoText}>
                            카카오톡 분석기 <span className={styles.pro}>Pro</span>
                        </span>
                    </Link>

                    <nav className={styles.nav}>
                        {navItems.map(({ path, icon: Icon, label }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`${styles.navLink} ${location.pathname === path ? styles.active : ''}`}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                                {location.pathname === path && (
                                    <motion.div
                                        className={styles.activeIndicator}
                                        layoutId="activeNav"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {children}
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>© 2024 카카오톡 대화 분석기 Pro. Powered by Gemini AI.</p>
            </footer>
        </div>
    )
}
