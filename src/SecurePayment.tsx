import React, { useState } from 'react';
import '@gr4vy/secure-fields-react/lib/style.css';
import {
    SecureFields,
    CardNumber,
    ExpiryDate,
    SecurityCode,
    useSecureFields
} from '@gr4vy/secure-fields-react';
import './SecurePayment.css';
import { authorisePayment } from './api';

type PaymentFormProps = {
    onStart: () => void;
    loading: boolean;
    error: string | null;
    success: boolean;
};

const PaymentForm = ({ onStart, loading, error, success }: PaymentFormProps) => {
    const { secureFields } = useSecureFields();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onStart();
        secureFields.submit();
    };

    if (success) {
        return (
            <div className="success-box">
                <h2>✓ Payment Successful</h2>
                <p>Your payment has been authorised successfully.</p>
            </div>
        );
    }

    return (
        <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="card-number">Card Number</label>
                <CardNumber id="card-number" placeholder="1234 5678 9012 3456" />
            </div>

            <div className="form-group">
                <label htmlFor="expiry-date">Expiry Date</label>
                <ExpiryDate id="expiry-date" placeholder="MM/YY" />
            </div>

            <div className="form-group">
                <label htmlFor="security-code">CVC</label>
                <SecurityCode id="security-code" placeholder="123" />
            </div>

            {error && <div className="error-box">{error}</div>}

            <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Processing…' : 'Pay Now'}
            </button>
        </form>
    );
};

interface SecurePaymentProps {
    checkoutSessionId: string;
}

const SecurePayment = ({ checkoutSessionId } : SecurePaymentProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onStart = () => {
        setLoading(true);
        setError(null);
    };

    const handleCardVaultSuccess = async () => {
        console.log('Card tokenized successfully, authorising payment...');
        
        try {
            // Step 2: Authorise the payment with the sessionId
            const response = await authorisePayment({
                sessionId: checkoutSessionId,
            });

            if (response.success) {
                setSuccess(true);
                setLoading(false);
                console.log('Payment authorised successfully:', response);
            } else {
                throw new Error(response.message || 'Payment authorisation failed');
            }
        } catch (err) {
            setLoading(false);
            setError(err instanceof Error ? err.message : 'Failed to authorise payment');
            console.error('Authorisation failure:', err);
        }
    };

    const handleCardVaultFailure = (err: unknown) => {
        setLoading(false);
        setError('Failed to tokenize card. Please check details.');
        console.error('Card vault failure:', err);
    };

    return (
        <SecureFields
            gr4vyId="wpay-test"
            environment="sandbox"
            sessionId={checkoutSessionId}
            debug
            onReady={() => console.log('Secure Fields ready')}
            onCardVaultSuccess={handleCardVaultSuccess}
            onCardVaultFailure={handleCardVaultFailure}
        >
            <div className="payment-card">
                <PaymentForm onStart={onStart} loading={loading} error={error} success={success} />
            </div>
        </SecureFields>
    );
};

export default SecurePayment;
