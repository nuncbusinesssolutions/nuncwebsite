# NUNC Business Solutions — Deployment, Backup & Disaster Recovery Guide

## 1. Vercel & GitHub Production Deployment Workflow
NUNC Business Solutions is deployed on **Vercel** with a connected **GitHub** repository.

### Prerequisites
1. **GitHub Repository:** Push this repository to your organization's private GitHub account (`https://github.com/nuncbusinesssolutions/...`).
2. **Vercel Import:** Connect the GitHub repository in the Vercel dashboard.
3. **Framework Preset:** Vite / React.
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`

### Production Environment Variables in Vercel
Configure the following in **Vercel Project Settings -> Environment Variables**:
```bash
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..." # Server-only
RESEND_API_KEY="re_..."
NOTIFICATION_EMAIL="nuncbusinesssolutions@gmail.com"
APP_URL="https://nuncbusinesssolutions.ph"
```

---

## 2. Supabase Storage Buckets Configuration
Create the following buckets in your Supabase project under **Storage -> New Bucket**:
1. `portfolio-media` (Public: Yes) — Demonstration thumbnails and architecture previews.
2. `service-media` (Public: Yes) — Service illustrations and iconography.
3. `client-vault` (Public: **No**) — Private proposals, signed contracts, invoices, and deliverables.
   - Enforce RLS storage policy: `auth.uid() IN (SELECT user_id FROM clients WHERE id = client_id)` or `role IN ('super_admin', 'staff')`.
4. `payment-proofs` (Public: **No**) — Deposit slips and e-wallet screenshots.

---

## 3. Backup Strategy & Disaster Recovery Procedures
In accordance with Section 34 of the Master Specification:

### Layer 1: Supabase Automated Daily Backups
- Supabase automatically maintains point-in-time recovery (PITR) and daily database snapshots on Pro/Enterprise plans.

### Layer 2: On-Demand Complete JSON Business Snapshot
- The Super Admin can navigate to **Admin Dashboard -> Backup & Disaster Recovery** at any time to download an encrypted, self-contained JSON snapshot of all business records (inquiries, clients, projects, milestones, invoices, payments, and CMS content).

### Layer 3: Database CLI Dump & Restoration
To perform a complete manual backup via the Supabase CLI / PostgreSQL utility:

```bash
# Export database dump
pg_dump -h db.your-project.supabase.co -U postgres -d postgres -F c -b -v -f nunc_backup_$(date +%Y%m%d).dump

# Restore database dump in emergency
pg_restore -h db.your-project.supabase.co -U postgres -d postgres -v nunc_backup_20261109.dump
```
