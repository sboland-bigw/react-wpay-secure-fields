// API configuration and utility functions for backend orchestration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface CheckoutSession {
    sessionId: string;
}

export interface AuthorisationRequest {
    sessionId: string;
    amount?: number;
    currency?: string;
}

export interface AuthorisationResponse {
    success: boolean;
    transactionId?: string;
    message?: string;
}

/**
 * Step 1: Create a checkout session
 * POST /checkout-sessions
 */
export const createCheckoutSession = async (): Promise<CheckoutSession> => {
    const response = await fetch(`${API_BASE_URL}/checkout-sessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });

    if (!response.ok) {
        let errorMessage = `Failed to create checkout session (${response.status})`;
        try {
            const errorData = await response.json();
            if (errorData.message) {
                errorMessage += `: ${errorData.message}`;
            }
        } catch {
            errorMessage += `: ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

/**
 * Step 2: Authorise payment with session ID
 * POST /authorisation
 */
export const authorisePayment = async (
    request: AuthorisationRequest
): Promise<AuthorisationResponse> => {
    const response = await fetch(`${API_BASE_URL}/authorisation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        let errorMessage = `Failed to authorise payment (${response.status})`;
        try {
            const errorData = await response.json();
            if (errorData.message) {
                errorMessage += `: ${errorData.message}`;
            }
        } catch {
            errorMessage += `: ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }

    return response.json();
};
