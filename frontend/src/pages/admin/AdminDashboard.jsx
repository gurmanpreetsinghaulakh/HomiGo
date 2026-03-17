import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import '../../styles/dashboard.css';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ listings: 0, revenue: 0 });
    const [listings, setListings] = useState([]);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (!user.isAdmin) { navigate('/dashboard'); return; }

        fetch('/api/listings')
            .then(r => r.json())
            .then(data => {
                const list = data.listings || (Array.isArray(data) ? data : []);
                setListings(list);
                setStats({
                    listings: list.length,
                    revenue: list.reduce((acc, l) => acc + (l.price || 0), 0),
                });
            })
            .catch(() => { });
    }, [user, navigate]);

    if (!user) return null;

    const actions = (
        <Link to="/listings/new" className="admin-add-btn" id="admin-add-listing">
            + Add Listing
        </Link>
    );

    return (
        <AdminLayout title="Platform Overview" actions={actions}>
            {/* Stats Cards */}
            <div className="admin-stats-grid">
                {[
                    { icon: '🏠', label: 'Total Listings', value: stats.listings, accent: '#7c3aed', trend: `+${Math.max(0, stats.listings - 2)} new` },
                    { icon: '👥', label: 'Registered Users', value: '—', accent: '#ff385c', trend: 'Active' },
                    { icon: '📋', label: 'Bookings', value: 0, accent: '#10b981', trend: 'This month' },
                    {
                        icon: '💰', label: 'Total Value',
                        value: `₹${stats.revenue >= 1000 ? `${(stats.revenue / 1000).toFixed(0)}K` : stats.revenue}`,
                        accent: '#f59e0b', trend: 'All listings'
                    },
                ].map(c => (
                    <div key={c.label} className="admin-stat-card" style={{ '--card-accent': c.accent }}>
                        <div className="admin-stat-icon">{c.icon}</div>
                        <div>
                            <div className="admin-stat-value">{c.value}</div>
                            <div className="admin-stat-label">{c.label}</div>
                        </div>
                        <div className="admin-stat-trend">{c.trend}</div>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div className="admin-quick-nav">
                {[
                    { to: '/admin/listings', icon: '🏠', label: 'Manage Listings', desc: 'View, edit & delete all listings' },
                    { to: '/admin/users', icon: '👥', label: 'Manage Users', desc: 'View registered users & roles' },
                    { to: '/admin/bookings', icon: '📋', label: 'Manage Bookings', desc: 'View and track all bookings' },
                    { to: '/admin/analytics', icon: '📈', label: 'Analytics', desc: 'Platform statistics & charts' },
                    { to: '/admin/settings', icon: '⚙️', label: 'Settings', desc: 'Configure platform preferences' },
                    { to: '/listings/new', icon: '➕', label: 'Add Listing', desc: 'Create a new property listing' },
                ].map(q => (
                    <Link key={q.to} to={q.to} className="admin-quick-card">
                        <span className="aqc-icon">{q.icon}</span>
                        <div>
                            <div className="aqc-label">{q.label}</div>
                            <div className="aqc-desc">{q.desc}</div>
                        </div>
                        <span className="aqc-arrow">→</span>
                    </Link>
                ))}
            </div>

            {/* Recent Listings */}
            <section className="db-section">
                <div className="db-section-header">
                    <h2 className="db-section-title">Recent Listings</h2>
                    <Link to="/admin/listings" className="db-see-all">Manage all →</Link>
                </div>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Property</th><th>Location</th><th>Price/night</th><th>Category</th><th>Actions</th></tr></thead>
                        <tbody>
                            {listings.slice(0, 5).map(l => (
                                <tr key={l._id}>
                                    <td>
                                        <div className="table-listing-cell">
                                            <img src={l.image?.url || 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=80&auto=format&fit=crop'} alt={l.title} className="table-listing-img" />
                                            <span className="table-listing-title">{l.title}</span>
                                        </div>
                                    </td>
                                    <td className="table-muted">{l.location}, {l.country}</td>
                                    <td><strong>₹{l.price?.toLocaleString()}</strong></td>
                                    <td><span className="table-category-badge">{l.category || 'Stay'}</span></td>
                                    <td>
                                        <div className="table-actions">
                                            <Link to={`/listings/${l._id}`} className="tbl-btn tbl-btn-view">View</Link>
                                            <Link to={`/listings/${l._id}/edit`} className="tbl-btn tbl-btn-edit">Edit</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {listings.length === 0 && (
                                <tr><td colSpan={5} className="table-empty">No listings yet. <Link to="/listings/new">Create one →</Link></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Activity Feed */}
            <section className="db-section">
                <h2 className="db-section-title">Recent Activity</h2>
                <div className="admin-activity-feed">
                    <div className="activity-item"><span className="activity-dot dot-green" /><span>Server is running normally</span><span className="activity-time">just now</span></div>
                    <div className="activity-item"><span className="activity-dot dot-purple" /><span>Admin account configured successfully</span><span className="activity-time">on startup</span></div>
                    <div className="activity-item"><span className="activity-dot dot-amber" /><span>{stats.listings} listings loaded from database</span><span className="activity-time">on load</span></div>
                </div>
            </section>
        </AdminLayout>
    );
}
