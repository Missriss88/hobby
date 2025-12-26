import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts'
import { SentimentPoint } from '@/types'
import styles from './SentimentChart.module.css'

interface SentimentChartProps {
    data: SentimentPoint[]
}

export default function SentimentChart({ data }: SentimentChartProps) {
    return (
        <div className={styles.container}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorMe" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FEE500" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FEE500" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPartner" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="time"
                        tick={{ fill: '#666', fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={false}
                    />

                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: '#666', fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={false}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1E1E1E',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        labelStyle={{ color: '#fff' }}
                    />

                    <Legend
                        wrapperStyle={{ paddingTop: '10px' }}
                    />

                    <Area
                        type="monotone"
                        dataKey="me"
                        name="나"
                        stroke="#FEE500"
                        strokeWidth={2}
                        fill="url(#colorMe)"
                        activeDot={{ r: 6, stroke: '#FEE500', strokeWidth: 2 }}
                    />

                    <Area
                        type="monotone"
                        dataKey="partner"
                        name="상대방"
                        stroke="#22C55E"
                        strokeWidth={2}
                        fill="url(#colorPartner)"
                        activeDot={{ r: 6, stroke: '#22C55E', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
