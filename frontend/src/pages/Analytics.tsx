import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Navbar from '../components/Navbar'
import api from '../services/api'

type Post = { id: number; title: string; views: number; likes: number }
type AnalyticsData = { totalPosts: number; totalViews: number; totalLikes: number; topPost: Post | null; posts: Post[] }
export default function Analytics() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null); useEffect(() => { api.get<AnalyticsData>('/analytics').then((response) => setAnalytics(response.data)).catch(() => setAnalytics(null)) }, []); 
    const posts = analytics?.posts || [];
    const data = posts.map((post) => ({ name: post.title.slice(0, 12), views: post.views })); 
    const total = analytics?.totalViews || 0
    return <>
        <Navbar />
        <main className="page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">INSIGHTS / PERFORMANCE</p>
                    <h1>Analytics</h1>
                    <p className="muted">A pulse check on the content your team publishes.</p>
                </div>
            </div>
            <div className="metric-grid">
                <div className="metric">
                    <span>TOTAL POSTS</span>
                    <strong>{analytics?.totalPosts || 0}</strong>
                    <p>Published in this workspace</p>
                </div>
                <div className="metric">
                    <span>TOTAL VIEWS</span>
                    <strong>{total}</strong>
                    <p>Across all posts</p>
                </div>
                <div className="metric">
                    <span>TOP POST</span>
                    <strong>{analytics?.topPost?.title?.slice(0, 16) || '—'}</strong>
                    <p>By current view count</p>
                </div>
            </div>
            <section className="chart-panel">
                <div className="section-title">
                    <div>
                        <p className="eyebrow">POST REACH</p>
                        <h2>Views by post</h2>
                    </div>
                    <span className="chart-total">{total} total</span>
                </div>
                <div className="chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#f1ede5' }} />
                            <Bar dataKey="views" fill="#e6603b" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </main></>
}
