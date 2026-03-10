import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGlobalModal } from '../context/ModalContext';
import UserLayout from '../components/UserLayout';

// Mock data since real bookings are not implemented yet
const MOCK_USER_BOOKINGS = [
    {
        _id: 'BK_USR_101',
        listingId: '67cb15512217cba50ba2b1f9', // Updated to match likely real listing IDs
        title: 'Beachfront Villa Goa',
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&auto=format&fit=crop',
        checkIn: '2026-03-15', checkOut: '2026-03-20',
        nights: 5, amount: 25000, status: 'confirmed'
    },
    {
        _id: 'BK_USR_102',
        listingId: '67cb15512217cba50ba2b1fa',
        title: 'Heritage Haveli Jaipur',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&auto=format&fit=crop',
        checkIn: '2026-04-01', checkOut: '2026-04-05',
        nights: 4, amount: 18000, status: 'pending'
    }
];

const STATUS_MAP = {
    confirmed: { label: '✓ Confirmed', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    pending: { label: '⏳ Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    cancelled: { label: '✕ Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
};

export default function UserBookings() {
    const { user } = useAuth();
    const { showModal, closeModal } = useGlobalModal();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState(MOCK_USER_BOOKINGS);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (user.isAdmin) { navigate('/admin-dashboard'); return; }
    }, [user, navigate]);

    const handleCancel = (id) => {
        const booking = bookings.find(b => b._id === id);
        showModal({
            title: 'Cancel Booking',
            message: `Are you sure you want to cancel your stay at "${booking.title}"?`,
            type: 'delete',
            confirmText: 'Yes, Cancel Stay',
            onConfirm: () => {
                setBookings(prev => prev.map(bk =>
                    bk._id === id ? { ...bk, status: 'cancelled' } : bk
                ));
                closeModal();
            }
        });
    };

    if (!user) return null;

    return (
        <UserLayout title="My Bookings" subtitle={`${bookings.length} reservations found`}>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {bookings.map(bh => (
                    <div key={bh._id} className="admin-stat-card" style={{
                        '--card-accent': '#10b981',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '1.5rem',
                        padding: '1.2rem'
                    }}>
                        <img
                            src={bh.image}
                            alt={bh.title}
                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '0.6rem' }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{bh.title}</h3>
                                <span style={{
                                    fontSize: '0.72rem', fontWeight: '700', padding: '0.25rem 0.65rem',
                                    borderRadius: '2rem', background: STATUS_MAP[bh.status].bg,
                                    color: STATUS_MAP[bh.status].color, border: `1px solid ${STATUS_MAP[bh.status].color}44`
                                }}>
                                    {STATUS_MAP[bh.status].label}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.8rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--db-muted)', marginBottom: '0.2rem' }}>Check-In</p>
                                    <p style={{ fontSize: '0.88rem', fontWeight: '600' }}>{bh.checkIn}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--db-muted)', marginBottom: '0.2rem' }}>Check-Out</p>
                                    <p style={{ fontSize: '0.88rem', fontWeight: '600' }}>{bh.checkOut}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--db-muted)', marginBottom: '0.2rem' }}>Amount</p>
                                    <p style={{ fontSize: '0.88rem', fontWeight: '600' }}>₹{bh.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link
                                to={`/listings/${bh.listingId}`}
                                className="tbl-btn tbl-btn-view"
                                style={{ fontSize: '0.75rem', textAlign: 'center', textDecoration: 'none' }}
                            >
                                Details
                            </Link>
                            {bh.status === 'pending' && (
                                <button
                                    onClick={() => handleCancel(bh._id)}
                                    className="tbl-btn tbl-btn-delete"
                                    style={{ fontSize: '0.75rem', cursor: 'pointer', border: 'none' }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {bookings.length === 0 && (
                <div className="table-empty" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                    <h2>No bookings yet</h2>
                    <p style={{ color: 'var(--db-muted)', marginTop: '0.5rem' }}>Your next adventure is just a click away!</p>
                    <Link to="/listings" className="admin-add-btn" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
                        Find Your Stay
                    </Link>
                </div>
            )}
        </UserLayout>
    );
}
