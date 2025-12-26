import {
    Radar,
    RadarChart as RechartsRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts'
import { CommunicationStyle } from '@/types'
import styles from './RadarChart.module.css'

interface RadarChartProps {
    data: CommunicationStyle
}

const labels: Record<keyof CommunicationStyle, string> = {
    affection: '애정도',
    humor: '유머/재치',
    trust: '신뢰도',
    conflict: '갈등관리',
    frequency: '대화빈도'
}

export default function RadarChart({ data }: RadarChartProps) {
    const chartData = Object.entries(data).map(([key, value]) => ({
        subject: labels[key as keyof CommunicationStyle],
        value: value,
        fullMark: 100
    }))

    return (
        <div className={styles.container}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsRadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={chartData}
                >
                    <PolarGrid
                        stroke="rgba(255,255,255,0.1)"
                        gridType="polygon"
                    />

                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#888', fontSize: 12 }}
                    />

                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: '#666', fontSize: 10 }}
                        axisLine={false}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1E1E1E',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        formatter={(value: number) => [`${value}점`, '']}
                    />

                    <Radar
                        name="대화 스타일"
                        dataKey="value"
                        stroke="#FEE500"
                        fill="#FEE500"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        dot={{
                            r: 4,
                            fill: '#FEE500',
                            stroke: '#1E1E1E',
                            strokeWidth: 2
                        }}
                    />
                </RechartsRadarChart>
            </ResponsiveContainer>
        </div>
    )
}
