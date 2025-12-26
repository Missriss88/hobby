import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import AnalysisPage from './pages/AnalysisPage'
import HistoryPage from './pages/HistoryPage'
import Layout from './components/common/Layout'

function App() {
    return (
        <Layout>
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/analysis" element={<AnalysisPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                </Routes>
            </AnimatePresence>
        </Layout>
    )
}

export default App
