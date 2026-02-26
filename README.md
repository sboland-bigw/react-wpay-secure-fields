# React PoC for WPay / Gr4vy Secure Fields

## Overview

This is a proof-of-concept React application that implements a 2-step orchestration flow for secure payment processing using WPay/Gr4vy Secure Fields.

## Payment Flow

The application implements a 2-step orchestration flow:

### Step 1: Create Checkout Session
- On app initialization, a POST request is made to `/checkout-sessions` (backend)
- The backend returns a `sessionId` that will be used for the payment

### Step 2: Collect Payment Details & Authorise
- The user enters their payment details in secure fields (card number, expiry, CVC)
- Upon form submission, the card details are tokenized by Gr4vy Secure Fields
- After successful tokenization, a POST request is made to `/authorisation` (backend) with the `sessionId` and other parameters
- The backend processes the authorization and returns the result

## Configuration

Create a `.env` file in the root directory (use `.env.example` as a template):

```bash
VITE_API_BASE_URL=http://localhost:3000
```

## Running 

```bash
yarn install
yarn dev
```

## Building

```bash
yarn build
```

## Backend Requirements

The backend must implement two endpoints:

### POST /checkout-sessions
Creates a new checkout session and returns a session ID.

**Response:**
```json
{
  "sessionId": "string"
}
```

### POST /authorisation
Authorises a payment using the session ID.

**Request:**
```json
{
  "sessionId": "string",
  "amount": number (optional),
  "currency": "string" (optional)
}
```

**Response:**
```json
{
  "success": boolean,
  "transactionId": "string" (optional),
  "message": "string" (optional)
}
```
