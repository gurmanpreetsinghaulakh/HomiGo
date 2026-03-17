import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';

// Simulated bookings since there's no booking model yet
const MOCK_BOOKINGS = [
    { id: 'BK001', guest: 'Priya Sharma', listing: 'Beachfront Villa Goa', checkIn: '2026-03-15', checkOut: '2026-03-20', nights: 5, amount: 25000, status: 'confirmed' },
    { id: 'BK002', guest: 'Rahul Verma', listing: 'Mountain Retreat Manali', checkIn: '2026-03-22', checkOut: '2026-03-25', nights: 3, amount: 12000, status: 'pending' },
    { id: 'BK003', guest: 'Ananya Patel', listing: 'Heritage Haveli Jaipur', checkIn: '2026-04-01', checkOut: '2026-04-05', nights: 4, amount: 18000, status: 'confirmed' },
    { id: 'BK004', guest: 'Arjun Singh', listing: 'Cosy Flat Mumbai', checkIn: '2026-04-10', checkOut: '2026-04-12', nights: 2, amount: 6000, status: 'cancelled' },
    { id: 'BK005', guest: 'Neha Gupta', listing: 'Treehouse Coorg', checkIn: '2026-04-18', checkOut: '2026-04-22', nights: 4, amount: 20000, status: 'confirmed' },
    { id: 'BK006', guest: 'Vikram Nair', listing: 'Houseboat Kerala', checkIn: '2026-05-01', checkOut: '2026-05-04', nights: 3, amount: 15000, status: 'pending' },
    { id: 'BK007', guest: 'Divya Reddy', listing: 'Desert Camp Jaisalmer', checkIn: '2026-05-10', checkOut: '2026-05-13', nights: 3, amount: 9000, status: 'confirmed' },
    { id: 'BK008', guest: 'Karan Mehta', listing: 'Luxury Penthouse Delhi', checkIn: '2026-05-20', checkOut: '2026-05-22', nights: 2, amount: 14000, status: 'cancelled' },
];

const STATUS_STYLES = {
    confirmed: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.25)', label: '✓ Confirmed' },
    pending: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)', label: '⏳ Pending' },
    cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'rgba(239,68,68,0.25)', label: '✕ Cancelled' },
};

export default function AdminBookings() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState(MOCK_BOOKINGS);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (!user.isAdmin) { navigate('/dashboard'); return; }
    }, [user, navigate]);

    const filtered = bookings.filter(b => {
        const matchStatus = statusFilter === 'all' || b.status === statusFilter;
        const q = search.toLowerCase();
        const matchSearch = !q || b.guest.toLowerCase().includes(q) || b.listing.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((a, b) => a + b.amount, 0);

    if (!user) return null;

    return (
        <AdminLayout title="Bookings" subtitle={`${filtered.length} bookings shown`}>
            {/* Stats row */}
            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                {[
                    { icon: '📋', label: 'Total', value: bookings.length, accent: '#7c3aed' },
                    { icon: '✅', label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, accent: '#10b981' },
                    { icon: '⏳', label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, accent: '#f59e0b' },
                    { icon: '💰', label: 'Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}K`, accent: '#ff385c' },
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
                    <input className="admin-search-input" placeholder="Search guest, listing, booking ID…" value={search} onChange={e => setSearch(e.target.value)} />
                    {search && <button className="search-clear-btn" onClick={() => setSearch('')}>✕</button>}
                </div>
                <div className="admin-filter-group">
                    {['all', 'confirmed', 'pending', 'cancelled'].map(s => (
                        <button
                            key={s}
                            className={`filter-pill ${statusFilter === s ? 'active' : ''}`}
                            onClick={() => setStatusFilter(s)}
                            id={`booking-filter-${s}`}
                        >
                            {s === 'all' ? 'All' : STATUS_STYLES[s].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
                <table className="admin-table" id="admin-bookings-table">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Guest</th>
                            <th>Property</th>
                            <th>Check-In</th>
                            <th>Check-Out</th>
                            <th>Nights</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(b => {
                            const s = STATUS_STYLES[b.status];
                            return (
                                <tr key={b.id}>
                                    <td><code className="booking-id">{b.id}</code></td>
                                    <td className="booking-guest">
                                        <div className="guest-avatar">{b.guest[0]}</div>
                                        <span>{b.guest}</span>
                                    </td>
                                    <td className="table-muted" style={{ maxWidth: '180px' }}>
                                        <span className="truncate-text">{b.listing}</span>
                                    </td>
                                    <td className="table-muted">{b.checkIn}</td>
                                    <td className="table-muted">{b.checkOut}</td>
                                    <td className="table-center">{b.nights}n</td>
                                    <td><strong>₹{b.amount.toLocaleString()}</strong></td>
                                    <td>
                                        <span className="status-badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                                            {s.label}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="tbl-btn tbl-btn-view" onClick={() => setSelected(b)} id={`view-booking-${b.id}`}>
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan={9} className="table-empty">No bookings match your filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail modal */}
            {selected && (
                <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Booking Detail — <code>{selected.id}</code></h3>
                            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-row"><span>Guest</span><strong>{selected.guest}</strong></div>
                            <div className="modal-row"><span>Property</span><strong>{selected.listing}</strong></div>
                            <div className="modal-row"><span>Check-In</span><strong>{selected.checkIn}</strong></div>
                            <div className="modal-row"><span>Check-Out</span><strong>{selected.checkOut}</strong></div>
                            <div className="modal-row"><span>Nights</span><strong>{selected.nights}</strong></div>
                            <div className="modal-row"><span>Amount</span><strong>₹{selected.amount.toLocaleString()}</strong></div>
                            <div className="modal-row"><span>Status</span>
                                <span className="status-badge" style={{ background: STATUS_STYLES[selected.status].bg, color: STATUS_STYLES[selected.status].color, border: `1px solid ${STATUS_STYLES[selected.status].border}` }}>
                                    {STATUS_STYLES[selected.status].label}
                                </span>
                            </div>
                        </div>
                        <div className="modal-actions">
                            {selected.status !== 'confirmed' && (
                                <button className="modal-btn modal-btn-confirm" onClick={() => { setBookings(bks => bks.map(b => b.id === selected.id ? { ...b, status: 'confirmed' } : b)); setSelected(s => ({ ...s, status: 'confirmed' })); }}>
                                    ✓ Mark Confirmed
                                </button>
                            )}
                            {selected.status !== 'cancelled' && (
                                <button className="modal-btn modal-btn-cancel" onClick={() => { setBookings(bks => bks.map(b => b.id === selected.id ? { ...b, status: 'cancelled' } : b)); setSelected(s => ({ ...s, status: 'cancelled' })); }}>
                                    ✕ Cancel Booking
                                </button>
                            )}
                            <button className="modal-btn modal-btn-close" onClick={() => setSelected(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
