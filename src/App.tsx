import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import SecurePayment from './SecurePayment';
import { createCheckoutSession } from './api';

const App: React.FC = () => {
    const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const initSession = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const session = await createCheckoutSession();
            setCheckoutSessionId(session.sessionId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create checkout session');
            console.error('Error creating checkout session:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        initSession();
    }, [initSession]);

    const handleReset = () => {
        setCheckoutSessionId(null);
        initSession();
    };

    return (
        <div className="page">
            {isLoading ? (
                <div className="card">
                    <h1>WPay Secure Payment</h1>
                    <p>Creating checkout session...</p>
                </div>
            ) : error ? (
                <div className="card">
                    <h1>WPay Secure Payment</h1>
                    <div className="error-box">{error}</div>
                    <div className="button-row">
                        <button className="primary-button" onClick={handleReset}>
                            Try Again
                        </button>
                    </div>
                </div>
            ) : checkoutSessionId ? (
                <>
                    <div className="header">
                        <h1>Payment Details</h1>
                        <button className="secondary-button" onClick={handleReset}>
                            Start New Session
                        </button>
                    </div>
                    <div className="payment-container">
                        <SecurePayment checkoutSessionId={checkoutSessionId} />
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default App;
