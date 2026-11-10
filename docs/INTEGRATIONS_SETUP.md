# NUNC Business Solutions — External Integrations Architecture

This guide details configuration procedures for external service modules. In accordance with Section 37 of the specification, **features requiring third-party credentials clearly indicate their configuration state in the Admin Dashboard and are never simulated as connected when pending credentials.**

---

## Initial Development Phase Configuration Status

| Integration Module | Phase 1 Status | Operational Notes |
| :--- | :--- | :--- |
| **Manual Payment Management** | **ACTIVE** | Bank transfers (BDO/BPI), GCash, Maya, cash, payment proof uploads, and milestone tracking (30/40/30) are 100% functional. |
| **Online Payment Gateway** | **DISABLED** | Online payment processing is disabled until an eligible gateway account is confirmed. Credentials are optional and never required for startup. |
| **Transactional Email (Resend)** | **ACTIVE (Server-side)** | Dispatches transactional notices to `NOTIFICATION_EMAIL` (`nuncbusinesssolutions@gmail.com`). `RESEND_API_KEY` is isolated to `server.ts`. |
| **Website Internal Live Chat** | **ACTIVE** | Standalone hybrid chat works independently for guest visitors and authenticated clients with attachment validation. |
| **Facebook Messenger** | **DISABLED** | Disabled until official Meta App ID, Secret, and Page webhook verification are configured. |
| **WhatsApp Business** | **DISABLED** | Disabled until WhatsApp Business Platform credentials are confirmed. |
| **Database (Supabase PostgreSQL)** | **ACTIVE** | Schema, migrations, and RLS policies are deployed. `SUPABASE_SERVICE_ROLE_KEY` is isolated to secure server-side execution. |

---

## 1. Transactional Email Notifications (Resend API)
- **Target Recipient:** `nuncbusinesssolutions@gmail.com`
- **Use Case:** Instant dispatch of incoming inquiries, booking requests, and invoice notifications.
- **Environment Variable:** `RESEND_API_KEY`
- **Setup Steps:**
  1. Register an account at [resend.com](https://resend.com).
  2. Verify your sending domain: `nuncbusinesssolutions.ph` (add DKIM, SPF, and DMARC TXT records in your DNS provider).
  3. Generate an API Key with `Sending Access`.
  4. Set `RESEND_API_KEY="re_..."` in your Vercel project environment variables.

---

## 2. Regional Payment Gateways (GCash, Maya, Debit/Credit Cards)
- **Supported Providers:** PayMongo, Xendit, or Maya Checkout.
- **Use Case:** Automated online payment links and instant webhook reconciliation.
- **Environment Variables:**
  - `PAYMENT_GATEWAY_PROVIDER="paymongo"`
  - `PAYMENT_GATEWAY_PUBLIC_KEY="pk_live_..."`
  - `PAYMENT_GATEWAY_SECRET_KEY="sk_live_..."`
  - `PAYMENT_GATEWAY_WEBHOOK_SECRET="whsec_..."`
- **Important Security Standard:**
  - Card numbers or CVVs are never handled or stored by NUNC servers (direct PCI-DSS tokenization on provider checkout).
  - Webhooks must verify cryptographic signatures (`PAYMENT_GATEWAY_WEBHOOK_SECRET`) before marking invoice records as paid.
  - **Manual payments (Bank transfers, manual GCash receipts) remain fully functional even when automated gateways are unconfigured.**

---

## 3. Omnichannel Messaging (Meta Messenger & WhatsApp)
- **Facebook Messenger:**
  - Requires a verified Facebook Page for NUNC Business Solutions.
  - Configure `META_APP_ID` and `META_APP_SECRET` within the Meta for Developers portal under the Messenger Webhooks product.
- **WhatsApp Business Cloud API:**
  - Requires Meta Business Manager verification.
  - Configure `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_ACCESS_TOKEN`.
- **Note:** NUNC's native website live chat functions 100% independently regardless of external social messaging integrations.

---

## 4. Online Meetings & Video Consultations
- Default Google Meet room: `https://meet.google.com/nunc-discovery`
- Custom Zoom room: `https://zoom.us/j/nuncsolutions`
- Configurable per appointment in the **Consultations Scheduler** module.
