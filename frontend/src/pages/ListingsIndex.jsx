import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/listings.css';

export default function ListingsIndex() {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaxes, setShowTaxes] = useState(false);
    const [searchParams] = useSearchParams();

    // Get active category from URL
    const activeCategory = searchParams.get('category') || 'All';

    useEffect(() => {
        setLoading(true);
        const category = searchParams.get('category');
        const q = searchParams.get('q');

        let url = '/api/listings';
        if (category && category !== 'All') {
            url = `/api/listings/filter?category=${category}`;
        } else if (q) {
            url = `/api/listings/search?q=${q}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setListings(data.listings || []);
                } else {
                    console.error(data.error);
                }
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setListings([]);
            })
            .finally(() => setLoading(false));
    }, [searchParams]);

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

    const getImageUrl = (listing) => {
        return listing.Image?.url || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop';
    };

    return (
        <div className="browse-stays-container">
            {/* Header / Filter Bar */}
            <div className="filters-wrapper">
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

                <div className="premium-tax-toggle" onClick={() => setShowTaxes(!showTaxes)}>
                    <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Display total price</span>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={showTaxes}
                            onChange={() => { }} // Handle click in container instead
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            {/* Content Grid */}
            <div className="stays-grid">
                {loading ? (
                    // Skeleton-like loading state
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="premium-card" style={{ opacity: 0.5 }}>
                            <div className="card-image-container" style={{ background: '#eee' }}></div>
                            <div style={{ height: '1.2rem', width: '70%', background: '#eee', marginBottom: '0.4rem' }}></div>
                            <div style={{ height: '1rem', width: '40%', background: '#eee' }}></div>
                        </div>
                    ))
                ) : listings.length > 0 ? (
                    listings.map((listing, idx) => (
                        <Link
                            key={listing._id}
                            to={`/listings/${listing._id}`}
                            className="premium-card"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <div className="card-image-container">
                                <img
                                    src={getImageUrl(listing)}
                                    className="premium-card-img"
                                    alt={listing.title}
                                    loading="lazy"
                                />
                                <button className="wishlist-btn" title="Add to Wishlist" onClick={(e) => {
                                    e.preventDefault();
                                    // Add wishlist logic here later
                                }}>
                                    <i className="fa-regular fa-heart"></i>
                                </button>
                            </div>

                            <div className="premium-card-info">
                                <h3 className="premium-card-title">{listing.title}</h3>
                                <p className="premium-card-meta">
                                    {listing.location}, {listing.country}
                                </p>
                                <p className="premium-card-meta">
                                    {listing.category || 'Stay'}
                                </p>
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
        </div>
    );
}
