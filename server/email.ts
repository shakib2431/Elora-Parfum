import { Order } from '../src/types/ecommerce';
import { emailService } from '../src/services/emailService';

interface SendNotificationParams {
  order: Order;
  paymentMeta?: any;
}

/**
 * Dispatches luxury-branded email notifications:
 * 1. Admin/Owner alert (Payment Verified & Order Paid)
 * 2. Customer confirmation (Elora Haute Parfumerie Editorial Commission Receipt)
 *
 * Designed to NEVER throw or block order flow even if SMTP/network is unconfigured.
 */
export async function sendOrderEmails({ order, paymentMeta }: SendNotificationParams): Promise<{
  adminEmailSent: boolean;
  customerEmailSent: boolean;
}> {
  try {
    const [adminRes, customerRes] = await Promise.allSettled([
      emailService.notifyAdminOnPaymentSuccess(order, paymentMeta),
      emailService.sendCustomerOrderConfirmation(order),
    ]);

    return {
      adminEmailSent: adminRes.status === 'fulfilled' && adminRes.value.success,
      customerEmailSent: customerRes.status === 'fulfilled' && customerRes.value.success,
    };
  } catch (err) {
    console.error('[sendOrderEmails] Unexpected failure in dispatch pipeline:', err);
    return {
      adminEmailSent: false,
      customerEmailSent: false,
    };
  }
}

