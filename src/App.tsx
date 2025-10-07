import React, { useState } from 'react';
import './App.css';
import SecurePayment from './SecurePayment';

const App: React.FC = () => {
    const [checkoutSessionId, setCheckoutSessionId] = useState('');
    const [isSessionSet, setIsSessionSet] = useState(false);

    const handleContinue = () => {
        if (checkoutSessionId.trim()) setIsSessionSet(true);
    };

    const handleReset = () => {
        setIsSessionSet(false);
        setCheckoutSessionId('');
    };

    return (
        <div className="page">
            {!isSessionSet ? (
                <div className="card">
                    <h1>WPay Secure Payment</h1>
                    <label htmlFor="session-id">Checkout Session ID</label>
                    <input
                        id="session-id"
                        type="text"
                        value={checkoutSessionId}
                        onChange={(e) => setCheckoutSessionId(e.target.value)}
                        placeholder="Enter checkout session ID"
                    />
                    <div className="button-row">
                        <button
                            className="primary-button"
                            onClick={handleContinue}
                            disabled={!checkoutSessionId.trim()}
                        >
                            Continue to Payment
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="header">
                        <h1>Payment Details</h1>
                        <button className="secondary-button" onClick={handleReset}>
                            Change Session
                        </button>
                    </div>
                    <div className="payment-container">
                        <SecurePayment checkoutSessionId={checkoutSessionId} />
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
