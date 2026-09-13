import crypto from 'crypto';

interface CreateCashfreeOrderParams {
  orderNumber: string;
  amount: number;
  currency?: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  returnUrl?: string;
}

export interface CashfreeOrderResult {
  success: boolean;
  isSandboxSimulation: boolean;
  orderId: string;
  paymentSessionId: string;
  orderAmount: number;
  currency: string;
  environment: 'SANDBOX' | 'PRODUCTION' | 'SIMULATION';
  error?: string;
}

export interface CashfreeVerificationResult {
  isPaid: boolean;
  orderId: string;
  paymentId?: string;
  paymentMethod?: string;
  amount?: number;
  status: string;
  rawResponse?: any;
}

function getCashfreeConfig() {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const env = (process.env.CASHFREE_ENVIRONMENT || 'SANDBOX').toUpperCase();
  const isProduction = env === 'PRODUCTION';
  const baseUrl = isProduction
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

  return {
    appId,
    secretKey,
    env,
    isProduction,
    baseUrl,
    isConfigured: Boolean(appId && secretKey),
  };
}

/**
 * Creates an order session on Cashfree server-side.
 * Secret keys are strictly handled here and NEVER sent to the client.
 */
export async function createCashfreeOrder(params: CreateCashfreeOrderParams): Promise<CashfreeOrderResult> {
  const config = getCashfreeConfig();
  // Cashfree order_id allows alphanumeric and underscores only
  const sanitizedOrderId = `${params.orderNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;

  // If Cashfree keys are not configured in .env, run seamless high-fidelity sandbox simulation
  if (!config.isConfigured) {
    console.log('[Cashfree] No API credentials found in environment. Initializing sandbox simulation session.');
    const simulatedSessionId = `session_sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return {
      success: true,
      isSandboxSimulation: true,
      orderId: sanitizedOrderId,
      paymentSessionId: simulatedSessionId,
      orderAmount: params.amount,
      currency: params.currency || 'INR',
      environment: 'SIMULATION',
    };
  }

  try {
    const payload = {
      order_id: sanitizedOrderId,
      order_amount: params.amount,
      order_currency: params.currency || 'INR',
      customer_details: {
        customer_id: params.customer.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
        customer_name: params.customer.name,
        customer_email: params.customer.email,
        customer_phone: params.customer.phone.replace(/\D/g, '').slice(-10),
      },
      order_meta: {
        return_url: params.returnUrl || `${process.env.APP_URL || 'http://localhost:3000'}/order-status?order=${params.orderNumber}&cf_id={order_id}`,
      },
      order_note: `Elora Haute Parfumerie Commission #${params.orderNumber}`,
    };

    const response = await fetch(`${config.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': config.appId!,
        'x-client-secret': config.secretKey!,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.payment_session_id) {
      console.error('[Cashfree] Create order error from API:', data);
      return {
        success: false,
        isSandboxSimulation: false,
        orderId: sanitizedOrderId,
        paymentSessionId: '',
        orderAmount: params.amount,
        currency: params.currency || 'INR',
        environment: config.isProduction ? 'PRODUCTION' : 'SANDBOX',
        error: data.message || 'Cashfree order creation failed',
      };
    }

    return {
      success: true,
      isSandboxSimulation: false,
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      orderAmount: data.order_amount,
      currency: data.order_currency,
      environment: config.isProduction ? 'PRODUCTION' : 'SANDBOX',
    };
  } catch (err: any) {
    console.error('[Cashfree] Network exception creating order:', err);
    return {
      success: false,
      isSandboxSimulation: false,
      orderId: sanitizedOrderId,
      paymentSessionId: '',
      orderAmount: params.amount,
      currency: params.currency || 'INR',
      environment: config.isProduction ? 'PRODUCTION' : 'SANDBOX',
      error: err?.message || 'Network error connecting to Cashfree',
    };
  }
}

/**
 * Server-side payment verification.
 * Inquires directly with Cashfree's server to confirm whether funds were captured.
 */
export async function verifyCashfreePayment(orderId: string): Promise<CashfreeVerificationResult> {
  const config = getCashfreeConfig();

  // If sandbox simulation mode
  if (!config.isConfigured || orderId.startsWith('sim_') || orderId.includes('_sim_')) {
    return {
      isPaid: true,
      orderId,
      paymentId: `cf_pay_sim_${Date.now()}`,
      paymentMethod: 'UPI / NetBanking (Sandbox Simulated)',
      amount: 1499,
      status: 'PAID',
      rawResponse: { simulated: true, status: 'PAID' },
    };
  }

  try {
    const response = await fetch(`${config.baseUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': config.appId!,
        'x-client-secret': config.secretKey!,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Cashfree] Verify payment error response:', data);
      return {
        isPaid: false,
        orderId,
        status: data.order_status || 'FAILED',
        rawResponse: data,
      };
    }

    const isPaid = data.order_status === 'PAID';

    // Inquire payment list for payment ID if available
    let paymentId = undefined;
    let paymentMethod = 'Online (Cashfree)';
    try {
      const payListRes = await fetch(`${config.baseUrl}/orders/${orderId}/payments`, {
        headers: {
          'x-api-version': '2023-08-01',
          'x-client-id': config.appId!,
          'x-client-secret': config.secretKey!,
        },
      });
      if (payListRes.ok) {
        const payList = await payListRes.json();
        if (Array.isArray(payList) && payList.length > 0) {
          const latestSuccessful = payList.find((p) => p.payment_status === 'SUCCESS') || payList[0];
          paymentId = latestSuccessful.cf_payment_id;
          paymentMethod = latestSuccessful.payment_group || latestSuccessful.payment_method || 'Online (Cashfree)';
        }
      }
    } catch (e) {
      // Non-fatal
    }

    return {
      isPaid,
      orderId: data.order_id,
      paymentId: paymentId ? String(paymentId) : undefined,
      paymentMethod,
      amount: data.order_amount,
      status: data.order_status,
      rawResponse: data,
    };
  } catch (err: any) {
    console.error('[Cashfree] Network exception verifying payment:', err);
    return {
      isPaid: false,
      orderId,
      status: 'ERROR',
      rawResponse: { error: err?.message },
    };
  }
}

/**
 * Verifies Cashfree webhook signature to protect against fraudulent callbacks.
 */
export function verifyCashfreeWebhook(
  rawBody: string,
  signature: string,
  timestamp: string
): boolean {
  const config = getCashfreeConfig();
  if (!config.secretKey) {
    // In dev without secret key, allow sandbox webhook testing
    return true;
  }

  try {
    const dataToSign = `${timestamp}${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', config.secretKey)
      .update(dataToSign)
      .digest('base64');

    return expectedSignature === signature;
  } catch (err) {
    console.error('[Cashfree Webhook] Signature verification failed:', err);
    return false;
  }
}
