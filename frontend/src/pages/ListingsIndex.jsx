import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGlobalModal } from '../context/ModalContext';
import '../styles/listings.css';

export default function ListingsIndex() {
    const { user } = useAuth();
    const { showModal } = useGlobalModal();
    const [listings, setListings] = useState([]);
    // No loading state needed
    const [loading, setLoading] = useState(true);
    const [showTaxes, setShowTaxes] = useState(false);
    const [wishlist, setWishlist] = useState(new Set());

    const [searchParams] = useSearchParams();

    // Removed infinite scroll refs

    // Get active category from URL
    const activeCategory = searchParams.get('category') || 'All';
    const q = searchParams.get('q');

    // Reset on param change
    useEffect(() => {
        setListings([]);
        setWishlist(new Set());
        setLoading(true);
        fetchListings();
    }, [searchParams]);

    // Initial load + pagination
    const fetchListings = useCallback(async () => {
        setLoading(true);
        const category = searchParams.get('category');
        const q = searchParams.get('q');

        let url = '/api/listings';
        if (category && category !== 'All') {
            url = `/api/listings/filter?category=${category}`;
        } else if (q) {
            url = `/api/listings/search?q=${q}`;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setListings(data.listings || []);
            } else {
                console.error(data.error);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setListings([]);
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);







    const categories = [
        { name: 'All', icon: <i className="fa-solid fa-house" /> },
        { name: 'Trending', icon: <i className="fa-solid fa-fire" /> },
        { name: 'Rooms', icon: <i className="fa-solid fa-bed" /> },
        { name: 'Beach', icon: <i className="fa-solid fa-umbrella-beach" /> },
        { name: 'Mountain', icon: <i className="fa-solid fa-mountain" /> },
        { name: 'City', icon: <i className="fa-solid fa-city" /> },
        { name: 'Heritage', icon: <i className="fa-solid fa-landmark" /> },
        { name: 'Forest', icon: <i className="fa-solid fa-tree" /> },
        { name: 'Farm', icon: <i className="fa-solid fa-tractor" /> },
        { name: 'Desert', icon: <i className="fa-solid fa-campground" /> },
        { name: 'Arctic', icon: <i className="fa-solid fa-snowflake" /> },
        { name: 'Pools', icon: <i className="fa-solid fa-person-swimming" /> }
    ];

    const listingCount = listings.length;

    // Toggle wishlist
    const toggleWishlist = useCallback((id) => {
        setWishlist(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
                showModal({
                    title: 'Removed from Wishlist',
                    message: 'Added back to explore list',
                    type: 'info'
                });
            } else {
                newSet.add(id);
                showModal({
                    title: 'Added to Wishlist ❤️',
                    message: 'Saved for later',
                    type: 'success'
                });
            }
            return newSet;
        });
    }, [showModal]);

    const getImageUrl = (listing) => {
        return listing.Image?.url || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop';
    };

    const isInWishlist = useCallback((id) => wishlist.has(id), [wishlist]);

    return (
        <div className="browse-stays-container">
            <section className="browse-hero">
                <div className="browse-hero-copy">
                    <span className="hero-chip">Curated stays</span>
                    <h1>Find a stay that feels like a getaway</h1>
                    <p>From peaceful countryside homes to modern city escapes, explore the best stays with bold style and instant booking.</p>
                </div>
                <div className="browse-hero-stats">
                    <div className="stat-block">
                        <span className="stat-value">{loading ? '...' : listingCount}</span>
                        <span className="stat-label">Properties live</span>
                    </div>
                    <div className="stat-block">
                        <span className="stat-value">{loading ? '...' : `${Math.max(1, listingCount * 2)}+`}</span>
                        <span className="stat-label">Local experiences</span>
                    </div>
                </div>
            </section>

            {/* Header / Filter Bar */}
            <div className="filters-wrapper">
                {/* Full width no left/right padding, tight top spacing */}
                
                {/* Back to Dashboard Button */}
                {user && (
                    <Link to={user.isAdmin ? '/admin-dashboard' : '/dashboard'} className="back-dash-btn" title="Back to Dashboard">
                        <span className="back-icon">⇽</span>
                        <span className="back-text">Dashboard</span>
                    </Link>
                )}

                <div className="category-scroll">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            to={cat.name === 'All' ? '/listings' : `/listings/filter?category=${cat.name}`}
                            className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
                        >
                            <span className="category-icon">{cat.icon}</span>
                            <span className="category-label">{cat.name}</span>
                        </Link>
                    ))}
                </div>

                <div className="premium-controls">
                    <div className="premium-tax-toggle" onClick={() => setShowTaxes(!showTaxes)}>
                        <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Total price</span>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={showTaxes} onChange={() => {}} />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
<div className="stays-grid">
                {loading ? (
                    // Enhanced skeleton loading
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="premium-card skeleton-card" style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className="card-image-container skeleton-image"></div>
                            <div className="premium-card-info">
                                <div className="skeleton-line long"></div>
                                <div className="skeleton-line short"></div>
                                <div className="skeleton-line" style={{ width: '30%', marginTop: '0.5rem' }}></div>
                            </div>
                        </div>
                    ))
                ) : listings.length > 0 ? (
                    listings.map((listing, idx) => (
                        <Link
                            key={listing._id}
                            to={`/listings/${listing._id}`}
                            className="premium-card"
                            style={{ '--index': idx, animationDelay: `${idx * 0.06}s` }}
                        >
                            <div className="card-image-container">
                                <img
                                    src={getImageUrl(listing)}
                                    className="premium-card-img"
                                    alt={listing.title}
                                    loading="lazy"
                                />
                                <button 
                                    className={`wishlist-btn ${isInWishlist(listing._id) ? 'active' : ''}`} 
                                    title={isInWishlist(listing._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist(listing._id);
                                    }}
                                >
                                    <i className={`fa${isInWishlist(listing._id) ? '-solid' : '-regular'} fa-heart`}></i>
                                </button>
                            </div>

                                    <div className="premium-card-info">
                                <div className="premium-card-meta-row">
                                    <span className="premium-card-badge">{listing.category || 'Stay'}</span>
                                    <span className={`availability-pill ${listing.availableRooms > 1 ? 'available' : 'low'}`}>
                                        {listing.availableRooms} room{listing.availableRooms === 1 ? '' : 's'} left
                                    </span>
                                </div>
                                <h3 className="premium-card-title">{listing.title}</h3>
                                <p className="premium-card-description">
                                    {listing.description ? `${listing.description.slice(0, 90)}...` : 'Stylish retreat with bright interiors and modern comforts.'}
                                </p>
                                <div className="premium-card-footer">
                                    <span>{listing.location}, {listing.country}</span>
                                    <span>{listing.roomType}</span>
                                </div>
                                <div className="premium-card-price">
                                    <strong>₹{listing.price?.toLocaleString("en-IN")}</strong>
                                    <span className="price-period"> / night</span>
                                    {showTaxes && <span className="tax-info">+18% GST</span>}
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="empty-stays">
                        <h2>No properties found</h2>
                        <p>Try adjusting your search or filters to find what you're looking for.</p>
                        <Link to="/listings" className="clear-search-btn" style={{ textDecoration: 'none' }}>
                            View all listings
                        </Link>
                    </div>
                )}
            </div>
            <div style={{ height: '2rem' }}></div> {/* Space below filter */}
            
        </div>
    );
}
