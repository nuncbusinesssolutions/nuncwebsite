# NUNC Business Solutions — Super Admin Provisioning & Security Architecture

## 1. Security First Principle
In strict adherence to enterprise security guidelines (Section 31 of the Master Specification):
- There is **no unrestricted public registration** for administrative accounts.
- Administrative credentials are **never hardcoded** in browser-accessible code.
- Administrative access is granted solely via server-authoritative Supabase Authentication or authenticated role management.

---

## 2. Initial Super Admin Provisioning Options

### Option A: Via Supabase Dashboard (Recommended for Production)
1. Go to your **Supabase Project Dashboard** -> **Authentication** -> **Users**.
2. Click **"Add User"** -> **"Create User"**.
3. Enter the official company administrator email (e.g., `admin@nuncbusinesssolutions.ph` or `nuncbusinesssolutions@gmail.com`) and a strong, unique 16+ character password.
4. Open the **SQL Editor** in Supabase and execute the following query to assign the `super_admin` role to the created user:

```sql
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  business_name,
  phone,
  role,
  department_id,
  is_active
)
SELECT 
  id,
  email,
  'NUNC Super Administrator',
  'NUNC Business Solutions',
  '09161669188',
  'super_admin',
  (SELECT id FROM public.departments WHERE name = 'Executive & Strategy' LIMIT 1),
  true
FROM auth.users 
WHERE email = 'admin@nuncbusinesssolutions.ph'
ON CONFLICT (id) DO UPDATE 
SET role = 'super_admin';
```

---

### Option B: Via Server-Side Provisioning Script (CLI / Edge Function)
Using the server-only `SUPABASE_SERVICE_ROLE_KEY` (kept strictly in backend environments, never committed to GitHub or exposed in `VITE_` variables):

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Bypass RLS for initial setup
);

async function provisionSuperAdmin(email: string, pass: string, name: string) {
  const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: pass,
    email_confirm: true
  });

  if (authError) throw authError;

  await supabaseAdmin.from('profiles').insert({
    id: user.user.id,
    email,
    full_name: name,
    business_name: 'NUNC Business Solutions',
    phone: '09161669188',
    role: 'super_admin',
    is_active: true
  });

  console.log(`Successfully provisioned Super Admin: ${email}`);
}
```

---

## 3. Staff Accounts Management
Once the Super Admin logs into the Admin Dashboard:
1. Navigate to **Staff & Departments**.
2. Create staff members, assign them to departments (Sales, Engineering, Customer Support, Finance, Operations), and specify position titles.
3. Configure role permissions according to organizational seniority.
