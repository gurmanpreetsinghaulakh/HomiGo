import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserLayout from '../components/UserLayout';

// Mock ratings
const MOCK_USER_REVIEWS = [
    {
        _id: 'REV_101',
        title: 'Beachfront Villa Goa',
        rating: 5,
        comment: "Absolutely breathtaking! The view from the balcony is worth every penny. Clean, spacious, and perfect hospitality.",
        date: '2026-03-25'
    },
    {
        _id: 'REV_102',
        title: 'Heritage Haveli Jaipur',
        rating: 4,
        comment: "Beautiful architecture and great service. Slightly far from the city center, but the peace was worth it.",
        date: '2026-02-10'
    }
];

export default function UserReviews() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState(MOCK_USER_REVIEWS);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (user.isAdmin) { navigate('/admin-dashboard'); return; }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <UserLayout title="My Reviews" subtitle={`${reviews.length} total reviews given`}>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.map(r => (
                    <div key={r._id} className="admin-stat-card" style={{
                        '--card-accent': '#ffc107',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        gap: '1.2rem',
                        padding: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.4rem' }}>{r.title}</h3>
                                <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                    {'⭐'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                </div>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--db-muted)' }}>{r.date}</span>
                        </div>
                        <p style={{
                            fontSize: '0.9rem', color: 'var(--db-text)', fontStyle: 'italic',
                            lineHeight: '1.6', background: 'rgba(255,255,255,0.03)',
                            padding: '1rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            "{r.comment}"
                        </p>
                        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                            <button className="tbl-btn tbl-btn-edit" style={{ fontSize: '0.75rem' }}>Edit Review</button>
                            <button className="tbl-btn tbl-btn-delete" style={{ fontSize: '0.75rem' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {reviews.length === 0 && (
                <div className="table-empty" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
                    <h2>No reviews written yet</h2>
                    <p style={{ color: 'var(--db-muted)', marginTop: '0.5rem' }}>Your feedback helps the community find the best stays!</p>
                    <Link to="/user/bookings" className="admin-add-btn" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
                        Review Your Stays
                    </Link>
                </div>
            )}
        </UserLayout>
    );
}
