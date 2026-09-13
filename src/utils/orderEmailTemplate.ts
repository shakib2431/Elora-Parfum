import { OrderRecord } from '../types';

/**
 * Generates an email-client compliant, inline-CSS luxury HTML email template
 * for Elora Parfum order confirmations.
 */
export function generateOrderConfirmationEmailHtml(order: OrderRecord): string {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 18px 0; border-bottom: 1px solid #24232C;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="vertical-align: top; width: 60px; padding-right: 16px;">
              <div style="width: 52px; height: 68px; background-color: #0E0E12; border: 1px solid #24232C; text-align: center; padding-top: 14px; box-sizing: border-box;">
                <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; color: #D4AF37; font-weight: 700; letter-spacing: 1px;">EL</span>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; color: #A1A1AA; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">100ML</div>
              </div>
            </td>
            <td style="vertical-align: top;">
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 9px; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-bottom: 3px;">
                ${item.category || 'Extrait de Parfum'}
              </div>
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; color: #FFFFFF; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 3px;">
                ${item.name}
              </div>
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #A1A1AA; line-height: 1.4;">
                ${item.size} · 25% Concentration · Qty: ${item.quantity}
              </div>
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; color: #D4D4D8; margin-top: 5px;">
                ✓ Genesis Batch 001 · Hand-numbered Flacon
              </div>
            </td>
            <td style="vertical-align: top; text-align: right; width: 90px;">
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #D4AF37; font-weight: 600;">
                ₹${(item.price * item.quantity).toLocaleString('en-IN')}
              </div>
              ${
                item.quantity > 1
                  ? `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; color: #A1A1AA;">₹${item.price.toLocaleString('en-IN')} each</div>`
                  : ''
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation #${order.orderNumber} · Elora Parfum</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0A0A0C; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0C; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- PREHEADER TEASER -->
  <div style="display: none; font-size: 1px; color: #0A0A0C; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Your bespoke Elora Parfum allocation #${order.orderNumber} is now entering priority preparation in our fragrance atelier.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0A0A0C;">
    <tr>
      <td align="center" style="padding: 30px 16px;">
        <!-- MAIN CONTAINER -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #14141B; border: 1px solid #2B2A36; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="padding: 40px 32px 30px 32px; text-align: center; background-color: #0E0E12; border-bottom: 1px solid #24232C;">
              <!-- GOLD CREST MONOGRAM -->
              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 16px auto;">
                <tr>
                  <td style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid #D4AF37; background-color: #14141B; text-align: center; vertical-align: middle;">
                    <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 700; color: #D4AF37; letter-spacing: 1px; line-height: 44px; display: inline-block;">❦</span>
                  </td>
                </tr>
              </table>

              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; color: #A1A1AA; text-transform: uppercase; letter-spacing: 4px; font-weight: 600; margin-bottom: 6px;">
                HAUTE PARFUMERIE · GRASSE & PARIS
              </div>
              <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 400; color: #FFFFFF; letter-spacing: 4px; text-transform: uppercase;">
                ELORA PARFUM
              </h1>
              <div style="margin-top: 14px;">
                <span style="display: inline-block; padding: 4px 12px; background-color: #1C1C24; border: 1px solid #2B2A36; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; color: #D4AF37; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                  ALLOCATION CONFIRMED · #${order.orderNumber}
                </span>
              </div>
            </td>
          </tr>

          <!-- PERSONALIZED GREETING -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h2 style="margin: 0 0 12px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 500; color: #FFFFFF;">
                Dear ${order.clientName},
              </h2>
              <p style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.65; color: #D4D4D8;">
                We have received your distinguished order and have formally reserved your flacons from our limited <strong>Genesis Batch 001</strong>. Each bottle has been formulated at a 25% Extrait concentration and will be sealed with our signature wax insignia prior to dispatch.
              </p>
              
              <!-- DISPATCH STATUS CALLOUT -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0E0E12; border: 1px solid #24232C; margin-top: 18px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="vertical-align: top; width: 24px; padding-right: 12px;">
                          <div style="font-size: 16px; color: #D4AF37; line-height: 1;">✦</div>
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #A1A1AA; font-weight: 700;">
                            Estimated Delivery Window
                          </div>
                          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; color: #FFFFFF; font-weight: 600; margin-top: 2px;">
                            ${order.estimatedDelivery}
                          </div>
                          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #A1A1AA; margin-top: 3px;">
                            Courier: ${order.carrier} · Airway Bill #${order.trackingNumber}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ITEMS SUMMARY -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; color: #D4AF37; text-transform: uppercase; letter-spacing: 2.5px; font-weight: 700; border-bottom: 1px solid #24232C; padding-bottom: 8px;">
                RESERVED OLFACTORY PIECES
              </div>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- GIFT WRAP & MESSAGE IF APPLICABLE -->
          ${
            order.giftWrap
              ? `
          <tr>
            <td style="padding: 16px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0E0E12; border: 1px solid #24232C;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #D4AF37; font-weight: 700;">
                      Signature Royal Velvet Presentation Wrapping
                    </div>
                    ${
                      order.giftMessage
                        ? `<div style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 12px; color: #FFFFFF; margin-top: 6px; line-height: 1.5;">"${order.giftMessage}"</div>`
                        : `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #A1A1AA; margin-top: 4px;">Plush ribbon with embossed artisan calligraphy tag attached.</div>`
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : ''
          }

          <!-- FINANCIAL BREAKDOWN -->
          <tr>
            <td style="padding: 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #D4D4D8;">
                <tr>
                  <td style="padding: 4px 0;">Atelier Subtotal</td>
                  <td style="padding: 4px 0; text-align: right; color: #FFFFFF;">₹${order.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                ${
                  order.discount > 0
                    ? `
                <tr>
                  <td style="padding: 4px 0; color: #D4AF37;">Privilege Savings</td>
                  <td style="padding: 4px 0; text-align: right; color: #D4AF37;">-₹${order.discount.toLocaleString('en-IN')}</td>
                </tr>
                `
                    : ''
                }
                ${
                  order.giftWrap
                    ? `
                <tr>
                  <td style="padding: 4px 0; color: #A1A1AA;">Ribbon & Calligraphy Tag</td>
                  <td style="padding: 4px 0; text-align: right; color: #FFFFFF;">+₹${order.giftWrapFee.toLocaleString('en-IN')}</td>
                </tr>
                `
                    : ''
                }
                <tr>
                  <td style="padding: 4px 0;">Insulated White-Glove Courier</td>
                  <td style="padding: 4px 0; text-align: right; color: #D4AF37; font-weight: 600; letter-spacing: 1px;">COMPLIMENTARY</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 10px; border-top: 1px solid #24232C;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-family: 'Playfair Display', Georgia, serif; font-size: 17px; font-weight: 600; color: #FFFFFF;">
                          Total Amount Paid
                        </td>
                        <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 600; color: #D4AF37; text-align: right;">
                          ₹${order.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="font-size: 10px; color: #A1A1AA; padding-top: 3px;">
                          Settled via ${order.paymentMethod} · Includes all luxury excise & duties
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SHIPPING DESTINATION & SECURITY -->
          <tr>
            <td style="padding: 0 32px 28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0E0E12; border: 1px solid #24232C;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF37; font-weight: 700; margin-bottom: 6px;">
                      Direct Delivery Address
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #FFFFFF; line-height: 1.5;">
                      <strong>${order.clientName}</strong><br>
                      ${order.shippingAddress}<br>
                      ${order.city}, ${order.state} ${order.postalCode}
                      ${order.clientPhone ? `<br><span style="color: #A1A1AA;">${order.clientPhone}</span>` : ''}
                    </div>
                    <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #2B2A36; font-size: 10px; color: #D4D4D8;">
                      🔒 Sealed with Tamper-Evident Hologram: <strong style="color: #D4AF37;">${order.tamperSealNumber}</strong>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA BUTTON: LIVE ORDER STATUS -->
          <tr>
            <td style="padding: 0 32px 32px 32px; text-align: center;">
              <a href="#track-order-${order.orderNumber}" style="display: inline-block; background-color: #D4AF37; color: #0A0A0C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; padding: 14px 34px; text-decoration: none;">
                Track Shipment Status Live →
              </a>
              <div style="margin-top: 10px; font-size: 10px; color: #A1A1AA;">
                Or enter Order ID <strong>${order.orderNumber}</strong> in our online concierge tracker
              </div>
            </td>
          </tr>

          <!-- APPLICATION & PRESERVATION RITUAL -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0E0E12; border-top: 1px solid #24232C;">
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 9px; text-transform: uppercase; letter-spacing: 2.5px; color: #D4AF37; font-weight: 700; margin-bottom: 8px;">
                THE MASTER PERFUMER’S CARE RITUAL
              </div>
              <p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #D4D4D8; line-height: 1.6;">
                • <strong>Shield from Direct Sunlight:</strong> Maintain your flacons in a cool, shaded sanctuary between 15°C and 20°C to preserve cold-pressed absolutes.
              </p>
              <p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #D4D4D8; line-height: 1.6;">
                • <strong>Pulse Point Aeration:</strong> Mist from 15cm away onto warm pulse points. Avoid rubbing wrists together to prevent disrupting top note volatility.
              </p>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #D4D4D8; line-height: 1.6;">
                • <strong>Sillage Longevity:</strong> Due to the 25% Extrait strength, 2 to 3 spritzes yield 10–14 hours of evolving radiance.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 30px 32px; text-align: center; background-color: #0A0A0C; border-top: 1px solid #24232C;">
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 500; color: #FFFFFF; letter-spacing: 2px;">
                ELORA PARFUM
              </div>
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; color: #A1A1AA; margin-top: 6px; line-height: 1.6;">
                Private Client Concierge: concierge@eloraparfum.com · +33 (0)4 93 36 00 12<br>
                14 Boulevard Fragonard, 06130 Grasse, France · Flagship Salon: Mumbai, India
              </div>
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 9px; color: #71717A; margin-top: 14px; letter-spacing: 0.5px;">
                © 2026 ELORA PARFUM HAUTE PARFUMERIE. ALL RIGHTS RESERVED.<br>
                EACH BOTTLE IS BACKED BY OUR 100% AUTHENTICITY GUARANTEE & ARTISANAL ARCHIVE.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
