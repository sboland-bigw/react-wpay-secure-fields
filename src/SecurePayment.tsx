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

type PaymentFormProps = {
    onStart: () => void;
    loading: boolean;
    error: string | null;
};

const PaymentForm = ({ onStart, loading, error }: PaymentFormProps) => {
    const { secureFields } = useSecureFields();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onStart();
        secureFields.submit();
    };

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

    const onStart = () => {
        setLoading(true);
        setError(null);
    };

    const handleCardVaultSuccess = () => {
        setLoading(false);
        console.log('Card tokenized successfully');
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
                <PaymentForm onStart={onStart} loading={loading} error={error} />
            </div>
        </SecureFields>
    );
};

export default SecurePayment;
