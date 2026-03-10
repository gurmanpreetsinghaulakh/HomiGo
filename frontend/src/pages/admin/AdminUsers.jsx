import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';

// Simulated user data
const MOCK_USERS = [
    { id: 'u1', username: 'ketansingla3246', email: 'ketansingla3246@gmail.com', isAdmin: true, joined: '2026-01-01', listings: 0, bookings: 0, status: 'active' },
    { id: 'u2', username: 'priya_sharma', email: 'priya@example.com', isAdmin: false, joined: '2026-01-15', listings: 2, bookings: 5, status: 'active' },
    { id: 'u3', username: 'rahul_verma', email: 'rahul@example.com', isAdmin: false, joined: '2026-02-03', listings: 0, bookings: 3, status: 'active' },
    { id: 'u4', username: 'ananya_patel', email: 'ananya@example.com', isAdmin: false, joined: '2026-02-20', listings: 1, bookings: 7, status: 'suspended' },
    { id: 'u5', username: 'arjun_singh', email: 'arjun@example.com', isAdmin: false, joined: '2026-03-01', listings: 0, bookings: 2, status: 'active' },
    { id: 'u6', username: 'neha_gupta', email: 'neha@example.com', isAdmin: false, joined: '2026-03-05', listings: 3, bookings: 11, status: 'active' },
];

export default function AdminUsers() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState(MOCK_USERS);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (!user.isAdmin) { navigate('/dashboard'); return; }
    }, [user, navigate]);

    const filtered = users.filter(u => {
        const q = search.toLowerCase();
        const matchSearch = !q || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        const matchRole = roleFilter === 'all' || (roleFilter === 'admin' ? u.isAdmin : !u.isAdmin);
        const matchStatus = statusFilter === 'all' || u.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    const toggleStatus = (id) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
        if (selected?.id === id) setSelected(prev => ({ ...prev, status: prev.status === 'active' ? 'suspended' : 'active' }));
    };

    if (!user) return null;

    return (
        <AdminLayout title="Users" subtitle={`${filtered.length} of ${users.length} users`}>
            {/* Stats */}
            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                {[
                    { icon: '👥', label: 'Total Users', value: users.length, accent: '#7c3aed' },
                    { icon: '✅', label: 'Active', value: users.filter(u => u.status === 'active').length, accent: '#10b981' },
                    { icon: '🛡', label: 'Admins', value: users.filter(u => u.isAdmin).length, accent: '#f59e0b' },
                    { icon: '⛔', label: 'Suspended', value: users.filter(u => u.status === 'suspended').length, accent: '#ff385c' },
                ].map(c => (
                    <div key={c.label} className="admin-stat-card" style={{ '--card-accent': c.accent }}>
                        <div className="admin-stat-icon">{c.icon}</div>
                        <div>
                            <div className="admin-stat-value">{c.value}</div>
                            <div className="admin-stat-label">{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="admin-filter-bar">
                <div className="admin-search-wrap">
                    <span className="search-icon-prefix">🔍</span>
                    <input className="admin-search-input" placeholder="Search by username or email…" value={search} onChange={e => setSearch(e.target.value)} />
                    {search && <button className="search-clear-btn" onClick={() => setSearch('')}>✕</button>}
                </div>
                <div className="admin-filter-group">
                    {[{ v: 'all', l: 'All' }, { v: 'admin', l: '🛡 Admin' }, { v: 'user', l: '👤 Users' }].map(o => (
                        <button key={o.v} className={`filter-pill ${roleFilter === o.v ? 'active' : ''}`} onClick={() => setRoleFilter(o.v)} id={`role-filter-${o.v}`}>{o.l}</button>
                    ))}
                    <div className="filter-divider" />
                    {[{ v: 'all', l: 'All Status' }, { v: 'active', l: 'Active' }, { v: 'suspended', l: 'Suspended' }].map(o => (
                        <button key={o.v} className={`filter-pill ${statusFilter === o.v ? 'active' : ''}`} onClick={() => setStatusFilter(o.v)}>{o.l}</button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
                <table className="admin-table" id="admin-users-table">
                    <thead>
                        <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Listings</th><th>Bookings</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div className="table-listing-cell">
                                        <div className="user-avatar-sm">{u.username[0].toUpperCase()}</div>
                                        <strong>{u.username}</strong>
                                    </div>
                                </td>
                                <td className="table-muted">{u.email}</td>
                                <td>
                                    <span className={`role-pill ${u.isAdmin ? 'role-admin' : 'role-user'}`}>
                                        {u.isAdmin ? '🛡 Admin' : '👤 User'}
                                    </span>
                                </td>
                                <td className="table-muted">{u.joined}</td>
                                <td className="table-center">{u.listings}</td>
                                <td className="table-center">{u.bookings}</td>
                                <td>
                                    <span className={`status-dot-badge ${u.status === 'active' ? 'status-active' : 'status-suspended'}`}>
                                        {u.status === 'active' ? '● Active' : '● Suspended'}
                                    </span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button className="tbl-btn tbl-btn-view" onClick={() => setSelected(u)} id={`view-user-${u.id}`}>Detail</button>
                                        <button
                                            className={`tbl-btn ${u.status === 'active' ? 'tbl-btn-suspend' : 'tbl-btn-activate'}`}
                                            onClick={() => toggleStatus(u.id)}
                                            id={`toggle-user-${u.id}`}
                                        >
                                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} className="table-empty">No users match your filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* User Detail Modal */}
            {selected && (
                <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()} id="user-detail-modal">
                        <div className="modal-header">
                            <h3>User Profile</h3>
                            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
                        </div>
                        <div className="modal-profile-header">
                            <div className="modal-user-avatar">{selected.username[0].toUpperCase()}</div>
                            <div>
                                <div className="modal-user-name">{selected.username}</div>
                                <span className={`role-pill ${selected.isAdmin ? 'role-admin' : 'role-user'}`}>
                                    {selected.isAdmin ? '🛡 Admin' : '👤 User'}
                                </span>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="modal-row"><span>Email</span><strong>{selected.email}</strong></div>
                            <div className="modal-row"><span>Joined</span><strong>{selected.joined}</strong></div>
                            <div className="modal-row"><span>Listings</span><strong>{selected.listings}</strong></div>
                            <div className="modal-row"><span>Bookings</span><strong>{selected.bookings}</strong></div>
                            <div className="modal-row"><span>Status</span>
                                <span className={`status-dot-badge ${selected.status === 'active' ? 'status-active' : 'status-suspended'}`}>
                                    {selected.status === 'active' ? '● Active' : '● Suspended'}
                                </span>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button
                                className={`modal-btn ${selected.status === 'active' ? 'modal-btn-cancel' : 'modal-btn-confirm'}`}
                                onClick={() => toggleStatus(selected.id)}
                            >
                                {selected.status === 'active' ? '⛔ Suspend User' : '✓ Activate User'}
                            </button>
                            <button className="modal-btn modal-btn-close" onClick={() => setSelected(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
