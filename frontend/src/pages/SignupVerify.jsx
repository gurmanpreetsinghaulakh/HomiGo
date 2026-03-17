import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function SignupVerify() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const timerRef = useRef(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        setInfo('Enter the 4-digit code sent to your email.');
        setError('');
        setSecondsLeft(60);
        setCanResend(false);

        timerRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setInfo('');

        try {
            const res = await fetch('/api/signup/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ otp: otp.trim() }),
            });
            const result = await res.json();

            if (result.success) {
                if (result.user) {
                    login(result.user);
                }
                navigate('/dashboard');
            } else {
                setError(result.error || 'Verification failed.');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');
        setInfo('');

        try {
            const res = await fetch('/api/signup/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const result = await res.json();
            if (result.success) {
                setInfo('A new code has been sent. It expires in 1 minute.');
                setSecondsLeft(60);
                setCanResend(false);
                timerRef.current && clearInterval(timerRef.current);
                timerRef.current = setInterval(() => {
                    setSecondsLeft(prev => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            setCanResend(true);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setError(result.error || 'Unable to resend OTP.');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />

            <div className="auth-card" id="signup-card">
                <Link to="/" className="auth-back-link">← Back to Home</Link>

                <div className="auth-logo">✦ HomiGo</div>
                <h1 className="auth-title">Verify your email</h1>
                <p className="auth-subtitle">Enter the code sent to your email to complete signup.</p>

                {info && (
                    <div className="auth-info" id="verify-info">
                        {info}
                    </div>
                )}

                {error && (
                    <div className="auth-error" id="verify-error">
                        <span>⚠</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form" id="verify-form">
                    <div className="auth-field">
                        <label htmlFor="otp">OTP Code</label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            placeholder="1234"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            required
                            autoComplete="one-time-code"
                        />
                    </div>

                    <div className="otp-footer">
                        <span className="otp-timer">Expires in {secondsLeft}s</span>
                        <button
                            type="button"
                            className="auth-link"
                            onClick={handleResend}
                            disabled={!canResend || loading}
                        >
                            Resend code
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        id="verify-submit-btn"
                        disabled={loading}
                    >
                        {loading ? <span className="btn-spinner" /> : 'Verify & Continue →'}
                    </button>
                </form>

                <p className="auth-footer-text" style={{ marginTop: '1.5rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">Log in</Link>
                </p>
            </div>
        </div>
    );
}
