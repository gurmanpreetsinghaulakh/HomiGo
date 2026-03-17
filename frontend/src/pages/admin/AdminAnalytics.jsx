import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Simulated time-series data
const MONTHLY_BOOKINGS = [12, 19, 8, 25, 32, 28, 40, 35, 22, 30, 45, 38];
const MONTHLY_REVENUE = [48, 76, 32, 100, 128, 112, 160, 140, 88, 120, 180, 152]; // in K

const CATEGORIES = [
    { name: 'Beach', count: 18, color: '#7c3aed' },
    { name: 'Mountain', count: 12, color: '#ff385c' },
    { name: 'City', count: 25, color: '#10b981' },
    { name: 'Heritage', count: 8, color: '#f59e0b' },
    { name: 'Forest', count: 7, color: '#06b6d4' },
];
const totalCat = CATEGORIES.reduce((a, c) => a + c.count, 0);

function BarChart({ data, labels, color, unit = '' }) {
    const max = Math.max(...data, 1);
    return (
        <div className="bar-chart">
            <div className="bar-chart-bars">
                {data.map((val, i) => (
                    <div key={i} className="bar-col">
                        <div className="bar-tooltip">{unit}{val}</div>
                        <div
                            className="bar-fill"
                            style={{ height: `${(val / max) * 100}%`, background: color }}
                        />
                        <div className="bar-label">{labels[i]}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DonutRing({ percentage, color, size = 80 }) {
    const r = (size - 10) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (percentage / 100) * circ;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-svg">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke={color} strokeWidth="8"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={circ * 0.25}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease' }}
            />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#f5f5f7" fontSize="13" fontWeight="700">
                {percentage}%
            </text>
        </svg>
    );
}

export default function AdminAnalytics() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [range, setRange] = useState('12m');

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (!user.isAdmin) { navigate('/dashboard'); return; }
        fetch('/api/listings')
            .then(r => r.json())
            .then(data => setListings(data.listings || (Array.isArray(data) ? data : [])))
            .catch(() => { });
    }, [user, navigate]);

    const rangeMap = { '3m': 3, '6m': 6, '12m': 12 };
    const N = rangeMap[range];
    const bookSlice = MONTHLY_BOOKINGS.slice(-N);
    const revSlice = MONTHLY_REVENUE.slice(-N);
    const labelSlice = MONTHS.slice(-N);
    const totalRevenue = revSlice.reduce((a, b) => a + b, 0);
    const totalBookings = bookSlice.reduce((a, b) => a + b, 0);

    const avgPrice = listings.length
        ? Math.round(listings.reduce((a, l) => a + (l.price || 0), 0) / listings.length)
        : 0;
    const topCountries = [...new Map(listings.map(l => [l.country, (listings.filter(x => x.country === l.country).length)])).entries()]
        .sort((a, b) => b[1] - a[1]).slice(0, 5);

    if (!user) return null;

    return (
        <AdminLayout title="Analytics" subtitle="Platform performance & insights">
            {/* Range Tabs */}
            <div className="analytics-range-bar">
                {['3m', '6m', '12m'].map(r => (
                    <button key={r} className={`range-tab ${range === r ? 'active' : ''}`} onClick={() => setRange(r)} id={`range-${r}`}>{r}</button>
                ))}
            </div>

            {/* KPI Cards */}
            <div className="admin-stats-grid">
                {[
                    { icon: '📋', label: 'Bookings', value: totalBookings, sub: `Last ${N} months`, accent: '#7c3aed' },
                    { icon: '💰', label: 'Revenue', value: `₹${totalRevenue}K`, sub: 'Confirmed bookings', accent: '#10b981' },
                    { icon: '🏠', label: 'Listings', value: listings.length, sub: 'Total on platform', accent: '#ff385c' },
                    { icon: '⭐', label: 'Avg Price', value: `₹${avgPrice.toLocaleString()}`, sub: 'Per night', accent: '#f59e0b' },
                ].map(c => (
                    <div key={c.label} className="admin-stat-card" style={{ '--card-accent': c.accent }}>
                        <div className="admin-stat-icon">{c.icon}</div>
                        <div>
                            <div className="admin-stat-value">{c.value}</div>
                            <div className="admin-stat-label">{c.label}</div>
                            <div className="admin-stat-sub">{c.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="analytics-charts-row">
                {/* Monthly Bookings */}
                <div className="analytics-chart-card">
                    <div className="chart-card-header">
                        <h3>Monthly Bookings</h3>
                        <span className="chart-total">{totalBookings} total</span>
                    </div>
                    <BarChart data={bookSlice} labels={labelSlice} color="linear-gradient(180deg,#a78bfa,#7c3aed)" unit="" />
                </div>

                {/* Monthly Revenue */}
                <div className="analytics-chart-card">
                    <div className="chart-card-header">
                        <h3>Revenue (₹K)</h3>
                        <span className="chart-total">₹{totalRevenue}K total</span>
                    </div>
                    <BarChart data={revSlice} labels={labelSlice} color="linear-gradient(180deg,#34d399,#10b981)" unit="₹" />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="analytics-bottom-row">
                {/* Category Breakdown */}
                <div className="analytics-chart-card">
                    <div className="chart-card-header"><h3>Listings by Category</h3></div>
                    <div className="category-breakdown">
                        {CATEGORIES.map(c => (
                            <div key={c.name} className="cat-row">
                                <div className="cat-info">
                                    <span className="cat-dot" style={{ background: c.color }} />
                                    <span className="cat-name">{c.name}</span>
                                    <span className="cat-count">{c.count}</span>
                                </div>
                                <div className="cat-bar-track">
                                    <div
                                        className="cat-bar-fill"
                                        style={{ width: `${(c.count / totalCat) * 100}%`, background: c.color }}
                                    />
                                </div>
                                <span className="cat-pct">{Math.round((c.count / totalCat) * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conversion Rings */}
                <div className="analytics-chart-card">
                    <div className="chart-card-header"><h3>Platform Health</h3></div>
                    <div className="rings-grid">
                        {[
                            { label: 'Booking Rate', pct: 68, color: '#7c3aed' },
                            { label: 'Occupancy', pct: 74, color: '#10b981' },
                            { label: 'User Retention', pct: 82, color: '#f59e0b' },
                            { label: 'Review Rate', pct: 55, color: '#ff385c' },
                        ].map(r => (
                            <div key={r.label} className="ring-item">
                                <DonutRing percentage={r.pct} color={r.color} size={90} />
                                <div className="ring-label">{r.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Countries */}
                <div className="analytics-chart-card">
                    <div className="chart-card-header"><h3>Top Countries</h3></div>
                    {topCountries.length > 0 ? (
                        <div className="country-list">
                            {topCountries.map(([country, count], i) => (
                                <div key={country} className="country-row">
                                    <span className="country-rank">#{i + 1}</span>
                                    <span className="country-name">{country || 'Unknown'}</span>
                                    <div className="country-bar-track">
                                        <div className="country-bar-fill" style={{ width: `${(count / topCountries[0][1]) * 100}%` }} />
                                    </div>
                                    <span className="country-count">{count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="table-empty" style={{ textAlign: 'center', padding: '2rem' }}>No listing data yet.</div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
