import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Server-side environment variable access (strictly guarded - never exposed to browser)
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'nuncbusinesssolutions@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Optional payment gateway variables
const PAYMENT_GATEWAY_PROVIDER = process.env.PAYMENT_GATEWAY_PROVIDER;
const PAYMENT_GATEWAY_SECRET_KEY = process.env.PAYMENT_GATEWAY_SECRET_KEY;
const PAYMENT_GATEWAY_PUBLIC_KEY = process.env.PAYMENT_GATEWAY_PUBLIC_KEY;
const PAYMENT_GATEWAY_WEBHOOK_SECRET = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET;

// Optional Meta & WhatsApp variables
const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// Initialize Resend client only if valid key is provided
let resendClient: Resend | null = null;
if (RESEND_API_KEY && RESEND_API_KEY.trim().length > 5) {
  try {
    resendClient = new Resend(RESEND_API_KEY.trim());
  } catch (err) {
    console.warn('[Resend] Failed to initialize Resend client gracefully:', err);
  }
}

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 2. Integration status query (safe public overview - NO secrets exposed)
app.get('/api/integrations/status', (_req: Request, res: Response) => {
  res.json({
    payments: {
      manualPaymentManagement: 'active', // Bank transfer, GCash, Maya manual recording & proof uploads
      onlinePaymentProcessing: 'disabled', // Disabled for initial phase until gateway credentials confirmed
      status: (PAYMENT_GATEWAY_SECRET_KEY && PAYMENT_GATEWAY_PUBLIC_KEY) ? 'configured_but_pending_activation' : 'awaiting_configuration',
      provider: PAYMENT_GATEWAY_PROVIDER || 'Not configured',
      hasOptionalKeys: Boolean(PAYMENT_GATEWAY_SECRET_KEY && PAYMENT_GATEWAY_PUBLIC_KEY),
      supportedManualMethods: ['bank_transfer', 'gcash', 'maya', 'cash']
    },
    email: {
      provider: 'resend',
      status: resendClient ? 'active' : 'awaiting_configuration',
      destinationEmail: NOTIFICATION_EMAIL,
      isConfigured: Boolean(resendClient)
    },
    messenger: {
      provider: 'meta_facebook_messenger',
      status: 'disabled', // Explicitly disabled until credentials configured
      isConfigured: Boolean(META_APP_ID && META_APP_SECRET)
    },
    whatsapp: {
      provider: 'whatsapp_business_cloud',
      status: 'disabled', // Explicitly disabled until credentials configured
      isConfigured: Boolean(WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID)
    },
    websiteLiveChat: {
      provider: 'internal_nunc_hybrid_chat',
      status: 'active', // Fully functional internal live chat for guests & clients
      isConfigured: true
    },
    database: {
      provider: 'supabase_postgresql',
      status: process.env.VITE_SUPABASE_URL ? 'active' : 'local_persistence_active',
      hasServerServiceRoleKey: Boolean(SUPABASE_SERVICE_ROLE_KEY)
    }
  });
});

// Helper to generate professional NUNC Business Solutions branded email HTML
function generateBrandedEmailHtml(options: {
  subject: string;
  message?: string;
  clientName?: string;
  clientEmail?: string;
  referenceNumber?: string;
  isTest?: boolean;
}) {
  const timestamp = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) + ' (PHT)';
  
  if (options.isTest) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NUNC Business Solutions - Email Configuration Test</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #1e40af; height: 6px;"></td>
          </tr>
          <tr>
            <td style="padding: 32px 36px 24px 36px; background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%); border-bottom: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 24px; font-weight: 800; letter-spacing: 0.05em; color: #1e40af; line-height: 1.2;">
                      NUNC
                    </div>
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; color: #475569; text-transform: uppercase;">
                      BUSINESS SOLUTIONS
                    </div>
                  </td>
                  <td align="right">
                    <span style="background-color: #dbeafe; color: #1e40af; font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">
                      Configuration Verified
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 24px 36px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">
                Email Configuration &amp; Connectivity Test
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                This automated test message confirms that the transactional email notification system for <strong>NUNC Business Solutions</strong> is operational and integrated with Resend.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 24px 0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="6">
                      <tr>
                        <td width="38%" style="font-size: 13px; font-weight: 600; color: #64748b;">Email Provider:</td>
                        <td width="62%" style="font-size: 13px; font-weight: 700; color: #0f172a;">Resend API (Server-Side)</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; font-weight: 600; color: #64748b;">Recipient Address:</td>
                        <td style="font-size: 13px; font-weight: 700; color: #1e40af;">nuncbusinesssolutions@gmail.com</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; font-weight: 600; color: #64748b;">Subject:</td>
                        <td style="font-size: 13px; color: #334155;">NUNC Business Solutions - Email Configuration Test</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; font-weight: 600; color: #64748b;">Execution Timestamp:</td>
                        <td style="font-size: 13px; color: #334155;">${timestamp}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; font-weight: 600; color: #64748b;">Security Architecture:</td>
                        <td style="font-size: 13px; color: #16a34a; font-weight: 600;">✓ Isolated Backend Proxy (No Client Exposure)</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <h2 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 24px 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em;">
                Operational Notification Capabilities
              </h2>
              <ul style="margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; line-height: 1.7; color: #475569;">
                <li><strong>Client Proposal &amp; Quote Requests:</strong> Automated business alerts upon client inquiry submission.</li>
                <li><strong>Payment Confirmations:</strong> Real-time notifications for GCash, Maya, and Bank Transfer verifications.</li>
                <li><strong>Support Tickets &amp; Client Inquiries:</strong> Immediate routing to the operations desk.</li>
                <li><strong>Milestone Progress:</strong> Automated updates dispatched to clients upon project milestones.</li>
              </ul>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px;">
                <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                  <strong>Confidentiality Note:</strong> This is an official system test generated by the NUNC Business Solutions platform backend. Credentials and API tokens are securely managed server-side and never exposed.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 36px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #334155;">
                NUNC Business Solutions
              </p>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b;">
                Technology &amp; Business Solutions Provider · Metro Manila, Philippines
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                Domain: nuncbusinesssolutions.ph · Contact: 09161669188 · Email: nuncbusinesssolutions@gmail.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  // Standard transactional template
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="background-color: #1e40af; color: #ffffff; padding: 18px; border-radius: 6px 6px 0 0;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 800; letter-spacing: 0.05em;">NUNC BUSINESS SOLUTIONS</h2>
        <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Business Operations Notification</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff;">
        <h3 style="color: #0f172a; margin-top: 0; font-size: 16px;">${options.subject}</h3>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">${options.message || ''}</p>
        <div style="margin-top: 20px; padding: 14px; background-color: #f8fafc; border-radius: 6px; font-size: 13px; color: #334155; border: 1px solid #e2e8f0;">
          <div><strong>Client:</strong> ${options.clientName || 'N/A'}</div>
          <div><strong>Email:</strong> ${options.clientEmail || 'N/A'}</div>
          <div><strong>Reference:</strong> ${options.referenceNumber || 'N/A'}</div>
          <div><strong>Timestamp:</strong> ${timestamp}</div>
        </div>
      </div>
      <div style="padding: 14px 20px; background-color: #f1f5f9; font-size: 11px; color: #64748b; text-align: center; border-radius: 0 0 6px 6px;">
        NUNC Business Solutions · nuncbusinesssolutions.ph · 09161669188 · nuncbusinesssolutions@gmail.com
      </div>
    </div>
  `.trim();
}

// 3. Server-side transactional email delivery via Resend
app.post('/api/notifications/email', async (req: Request, res: Response) => {
  try {
    const { type, subject, message, clientName, clientEmail, referenceNumber } = req.body;

    const emailSubject = subject || `[NUNC Business Solutions] ${type || 'Notification'} - ${referenceNumber || 'General'}`;
    const emailHtml = generateBrandedEmailHtml({
      subject: emailSubject,
      message,
      clientName,
      clientEmail,
      referenceNumber,
      isTest: false
    });

    if (resendClient) {
      // First attempt: Primary branded domain
      let sendResult = await resendClient.emails.send({
        from: 'NUNC Business Solutions <notifications@nuncbusinesssolutions.ph>',
        to: [NOTIFICATION_EMAIL],
        subject: emailSubject,
        html: emailHtml
      });

      // If domain is unverified, fallback to Resend's onboard sender to ensure delivery
      if (sendResult.error && (sendResult.error.message?.includes('domain') || sendResult.error.name === 'validation_error')) {
        console.log('[Resend Notice] Primary domain unverified, retrying via onboarding@resend.dev...');
        sendResult = await resendClient.emails.send({
          from: 'NUNC Business Solutions <onboarding@resend.dev>',
          to: [NOTIFICATION_EMAIL],
          subject: emailSubject,
          html: emailHtml
        });
      }

      if (sendResult.error) {
        console.warn('[Resend API Error]:', sendResult.error.message);
        return res.status(400).json({
          success: false,
          delivered: false,
          provider: 'resend',
          destination: NOTIFICATION_EMAIL,
          error: sendResult.error.message
        });
      }

      return res.json({
        success: true,
        delivered: true,
        provider: 'resend',
        destination: NOTIFICATION_EMAIL,
        id: sendResult.data?.id
      });
    }

    // Graceful handling when RESEND_API_KEY is not configured
    console.log(`[Server Transactional Email Logged -> ${NOTIFICATION_EMAIL}]:`, emailSubject);
    return res.json({
      success: true,
      delivered: false,
      simulated: true,
      destination: NOTIFICATION_EMAIL,
      notice: 'RESEND_API_KEY is awaiting configuration. Notification recorded gracefully in server operations.'
    });

  } catch (error: any) {
    console.error('[Notification Route Error]:', error?.message || error);
    res.status(500).json({
      success: false,
      error: 'Failed to process notification request.'
    });
  }
});

// 4. Dedicated secure test email endpoint for configuration verification
app.post('/api/notifications/test-email', async (_req: Request, res: Response) => {
  try {
    const testSubject = 'NUNC Business Solutions - Email Configuration Test';
    const testHtml = generateBrandedEmailHtml({
      subject: testSubject,
      isTest: true
    });

    if (!resendClient) {
      return res.status(503).json({
        success: false,
        delivered: false,
        provider: 'resend',
        destination: NOTIFICATION_EMAIL,
        error: 'RESEND_API_KEY is not initialized on the server.'
      });
    }

    console.log(`[Test Email] Initiating delivery to ${NOTIFICATION_EMAIL}...`);

    // Attempt 1: Branded domain
    let sendResult = await resendClient.emails.send({
      from: 'NUNC Business Solutions <notifications@nuncbusinesssolutions.ph>',
      to: [NOTIFICATION_EMAIL],
      subject: testSubject,
      html: testHtml
    });

    let senderUsed = 'notifications@nuncbusinesssolutions.ph';

    // Attempt 2: If custom domain not yet verified, fallback to onboarding@resend.dev
    if (sendResult.error && (sendResult.error.message?.includes('domain') || sendResult.error.name === 'validation_error')) {
      console.log(`[Test Email] Domain unverified (${sendResult.error.message}), falling back to onboarding@resend.dev...`);
      senderUsed = 'onboarding@resend.dev';
      sendResult = await resendClient.emails.send({
        from: 'NUNC Business Solutions <onboarding@resend.dev>',
        to: [NOTIFICATION_EMAIL],
        subject: testSubject,
        html: testHtml
      });
    }

    if (sendResult.error) {
      console.error('[Test Email Failed]:', sendResult.error);
      return res.status(400).json({
        success: false,
        delivered: false,
        provider: 'resend',
        senderAttempted: senderUsed,
        destination: NOTIFICATION_EMAIL,
        error: sendResult.error.message,
        errorCode: sendResult.error.name
      });
    }

    console.log(`[Test Email Succeeded] Delivery confirmed. ID: ${sendResult.data?.id}`);
    return res.json({
      success: true,
      delivered: true,
      provider: 'resend',
      senderUsed,
      destination: NOTIFICATION_EMAIL,
      subject: testSubject,
      emailId: sendResult.data?.id,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[Test Email Unexpected Error]:', error?.message || error);
    res.status(500).json({
      success: false,
      delivered: false,
      error: error?.message || 'Unexpected server error while sending test email.'
    });
  }
});

// ---------------------------------------------------------------------------
// Server Initialization with Vite Middlewares (Dev) or Static Files (Prod)
// ---------------------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NUNC Business Solutions server running on http://0.0.0.0:${PORT}`);
    console.log(`- Manual Payment Management: ACTIVE (Bank Transfer, GCash, Maya)`);
    console.log(`- Online Payment Processing: DISABLED (Initial Development Phase)`);
    console.log(`- Messenger & WhatsApp Integrations: DISABLED (Awaiting Configuration)`);
    console.log(`- Website Live Chat: ACTIVE (Internal Hybrid System)`);
    console.log(`- Transactional Email Recipient: ${NOTIFICATION_EMAIL}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
