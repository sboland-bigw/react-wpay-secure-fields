import React, { useState, useEffect } from 'react';
import './App.css';
import SecurePayment from './SecurePayment';
import { createCheckoutSession } from './api';

const App: React.FC = () => {
    const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initSession = async () => {
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
        };

        initSession();
    }, []);

    const handleReset = () => {
        setCheckoutSessionId(null);
        setIsLoading(true);
        setError(null);
        
        // Create a new session
        createCheckoutSession()
            .then(session => {
                setCheckoutSessionId(session.sessionId);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err instanceof Error ? err.message : 'Failed to create checkout session');
                setIsLoading(false);
            });
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
