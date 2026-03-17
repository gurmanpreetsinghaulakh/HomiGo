import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGlobalModal } from '../context/ModalContext';
import '../styles/showListing.css';

export default function ShowListing() {
    const { id } = useParams();
    const { user } = useAuth();
    const { showModal, setModalLoading, closeModal } = useGlobalModal();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/listings/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setListing(data.listings);
                } else {
                    console.error(data.error);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = () => {
        showModal({
            title: 'Delete Listing',
            message: `Are you sure you want to permanently delete "${listing.title}"? This cannot be undone.`,
            type: 'delete',
            confirmText: 'Delete Property',
            onConfirm: async () => {
                setModalLoading(true);
                try {
                    const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        navigate('/admin/listings');
                        closeModal();
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setModalLoading(false);
                }
            }
        });
    };

    if (loading) return (
        <div className="show-page-container">
            <div className="admin-loading">
                <div className="admin-spinner" />
                <p>Loading property details...</p>
            </div>
        </div>
    );

    if (!listing) return (
        <div className="show-page-container">
            <div className="empty-stays">
                <h2>Listing not found</h2>
                <p>The property you're looking for doesn't exist or has been removed.</p>
                <Link to="/listings" className="clear-search-btn" style={{ textDecoration: 'none' }}>
                    Browse other stays
                </Link>
            </div>
        </div>
    );

    const isOwnerOrAdmin = user && (user.isAdmin || user._id === listing.owner?._id);

    return (
        <div className="show-page-container">
            {/* Header */}
            <header className="show-header">
                <h1 className="show-title">{listing.title}</h1>
                <div className="show-meta">
                    <span className="show-meta-item">📍 {listing.location}, {listing.country}</span>
                    <div className="meta-dot"></div>
                    <span className="show-meta-item">🏠 {listing.category || 'Stay'}</span>
                    <div className="meta-dot"></div>
                    <span className="show-meta-item">👤 Host: {listing.owner?.username || 'Verified Partner'}</span>
                </div>
            </header>

            {/* Main Image */}
            <div className="show-image-hero">
                <img
                    src={listing.Image?.url || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&auto=format&fit=crop'}
                    className="show-hero-img"
                    alt={listing.title}
                />
            </div>

            {/* Main Content Grid */}
            <div className="show-content-grid">
                <div className="show-description-section">
                    <div className="host-info">
                        <div className="host-avatar">
                            {listing.owner?.username ? listing.owner.username[0].toUpperCase() : 'H'}
                        </div>
                        <div className="host-details">
                            <h3>Hosted by {listing.owner?.username || 'Partner'}</h3>
                            <p className="host-stats">12 bookings &bull; Highly rated for hospitality</p>
                        </div>
                    </div>

                    <div className="description-text">
                        <p style={{ whiteSpace: 'pre-line' }}>{listing.description}</p>
                    </div>

                    {/* Admin Actions */}
                    {isOwnerOrAdmin && (
                        <div className="admin-action-btns">
                            <Link to={`/admin/listings/${listing._id}/edit`} className="tbl-btn tbl-btn-edit" style={{ textDecoration: 'none', padding: '0.8rem 1.5rem' }}>
                                Edit Property
                            </Link>
                            <button onClick={handleDelete} className="tbl-btn tbl-btn-delete" style={{ padding: '0.8rem 1.5rem' }}>
                                Delete Property
                            </button>
                        </div>
                    )}
                </div>

                {/* Booking Sticky Card */}
                <aside className="booking-sticky-card">
                    <div className="booking-prices">
                        <div className="booking-price-value">
                            ₹{listing.price?.toLocaleString('en-IN')} <span className="price-unit">/ night</span>
                        </div>
                        <div className="booking-rating">
                            ⭐ 4.9 &bull; <span style={{ textDecoration: 'underline' }}>12 reviews</span>
                        </div>
                    </div>

                    <button className="book-btn-primary" onClick={() => {
                        if (!user) {
                            navigate('/login');
                        } else {
                            // Booking logic would go here
                            showModal({
                                title: 'Booking Request',
                                message: 'Booking functionality is currently being implemented. Check back soon!',
                                type: 'info',
                                confirmText: 'Got it'
                            });
                        }
                    }}>
                        Check Availability
                    </button>

                    <div className="booking-footer">
                        <p className="booking-note">You won't be charged yet</p>

                        <div className="booking-calc-row">
                            <span style={{ textDecoration: 'underline' }}>₹{listing.price?.toLocaleString()} x 5 nights</span>
                            <span>₹{(listing.price * 5).toLocaleString()}</span>
                        </div>
                        <div className="booking-calc-row">
                            <span style={{ textDecoration: 'underline' }}>Cleaning fee</span>
                            <span>₹{Math.round(listing.price * 0.1).toLocaleString()}</span>
                        </div>
                        <div className="booking-calc-row total">
                            <span>Total cost</span>
                            <span>₹{Math.round(listing.price * 5.1).toLocaleString()}</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
