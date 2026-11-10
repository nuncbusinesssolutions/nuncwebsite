-- ============================================================================
-- NUNC BUSINESS SOLUTIONS — POSTGRESQL SUPABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- Description: Core schema, tables, foreign keys, indexes, and Row Level Security (RLS)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. DEPARTMENTS & STAFF POSITIONS
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.staff_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    responsibilities TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES & ROLES
CREATE TYPE public.app_user_role AS ENUM ('super_admin', 'staff', 'client');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    business_name VARCHAR(200),
    phone VARCHAR(50),
    role public.app_user_role NOT NULL DEFAULT 'client',
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    position_id UUID REFERENCES public.staff_positions(id) ON DELETE SET NULL,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLIENTS DIRECTORY
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    total_billed_php NUMERIC(14, 2) DEFAULT 0.00,
    total_paid_php NUMERIC(14, 2) DEFAULT 0.00,
    total_billed_usd NUMERIC(14, 2) DEFAULT 0.00,
    total_paid_usd NUMERIC(14, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_email ON public.clients(email);

-- 4. INQUIRIES & WORKFLOW
CREATE TYPE public.inquiry_status AS ENUM (
    'new',
    'under_review',
    'awaiting_client',
    'approved',
    'rejected',
    'converted',
    'closed'
);

CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service_id VARCHAR(50) NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    budget_range VARCHAR(100) NOT NULL,
    requirements TEXT NOT NULL,
    preferred_contact VARCHAR(50) NOT NULL DEFAULT 'email',
    status public.inquiry_status NOT NULL DEFAULT 'new',
    assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    status_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiries_ref ON public.inquiries(reference_number);
CREATE INDEX idx_inquiries_status ON public.inquiries(status);

-- 5. PROJECTS & MILESTONES
CREATE TYPE public.project_status AS ENUM ('planning', 'in_progress', 'on_hold', 'completed');

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    manager_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    service_category VARCHAR(100) NOT NULL,
    status public.project_status NOT NULL DEFAULT 'planning',
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    budget_total NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'PHP',
    start_date DATE NOT NULL,
    target_end_date DATE NOT NULL,
    actual_end_date DATE,
    detailed_tracking_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    percentage_weight NUMERIC(5, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    amount NUMERIC(14, 2),
    currency VARCHAR(10) DEFAULT 'PHP',
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TASKS & INTERNAL COLLABORATION
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'under_review', 'completed', 'on_hold');

CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    priority public.task_priority NOT NULL DEFAULT 'medium',
    status public.task_status NOT NULL DEFAULT 'todo',
    due_date DATE,
    subtasks JSONB DEFAULT '[]'::jsonb,
    internal_comments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. APPOINTMENTS SCHEDULING
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(50) NOT NULL UNIQUE,
    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    business_name VARCHAR(200),
    service_interested_in VARCHAR(150) NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'online', -- 'online' or 'in_person'
    meeting_platform VARCHAR(50),
    meeting_link TEXT,
    location_address TEXT,
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    time_zone VARCHAR(50) NOT NULL DEFAULT 'Asia/Manila (GMT+8)',
    requirements TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_schedule_slot UNIQUE (date, time_slot)
);

-- 8. QUOTATIONS & INVOICES (MULTI-CURRENCY)
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number VARCHAR(50) NOT NULL UNIQUE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name VARCHAR(150) NOT NULL,
    client_business VARCHAR(200) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'PHP',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(14, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 12.00,
    tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    discount_total NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(14, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'draft',
    valid_until DATE NOT NULL,
    payment_terms TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name VARCHAR(150) NOT NULL,
    client_business VARCHAR(200) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    project_title VARCHAR(255),
    currency VARCHAR(10) NOT NULL DEFAULT 'PHP',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(14, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 12.00,
    tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    discount_total NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(14, 2) NOT NULL,
    amount_paid NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(14, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'sent',
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    payment_instructions TEXT,
    is_manual_upload BOOLEAN DEFAULT FALSE,
    manual_pdf_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PAYMENT RECORDS & PROOFS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_reference VARCHAR(50) NOT NULL UNIQUE,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name VARCHAR(150) NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'PHP',
    payment_date DATE NOT NULL,
    method VARCHAR(50) NOT NULL, -- 'bank_transfer', 'gcash', 'maya', 'card'
    transaction_reference VARCHAR(150) NOT NULL,
    proof_url TEXT,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    verified_by_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DOCUMENT VAULT
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(50),
    file_url TEXT NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    uploaded_by VARCHAR(150) NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT TRUE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. OMNICHANNEL MESSAGING
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_session_id VARCHAR(100),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    channel VARCHAR(50) NOT NULL DEFAULT 'website_chat',
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    last_message_snippet TEXT,
    last_message_time TIMESTAMPTZ DEFAULT NOW(),
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id VARCHAR(100) NOT NULL,
    sender_name VARCHAR(150) NOT NULL,
    sender_role VARCHAR(30) NOT NULL,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN NOT NULL DEFAULT FALSE
);

-- 12. CMS CONTENT (SERVICES, PORTFOLIO, FAQS, CMS, LEGAL)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    detailed_info TEXT NOT NULL,
    benefits JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    service_faqs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    demo_label VARCHAR(50) NOT NULL DEFAULT 'DEMO PROJECT',
    tags JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.legal_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    last_updated VARCHAR(50) NOT NULL,
    is_draft BOOLEAN NOT NULL DEFAULT TRUE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.website_cms (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'current',
    hero_headline TEXT NOT NULL,
    hero_subtext TEXT NOT NULL,
    cta_primary_text VARCHAR(100) NOT NULL,
    cta_secondary_text VARCHAR(100) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    company_email VARCHAR(255) NOT NULL,
    company_phone VARCHAR(50) NOT NULL,
    company_domain VARCHAR(100) NOT NULL,
    mission TEXT NOT NULL,
    vision TEXT NOT NULL,
    core_values JSONB NOT NULL DEFAULT '[]'::jsonb,
    announcement_text TEXT,
    announcement_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Staff and Super Admin have full access to business records
CREATE POLICY "Staff Full Access Profiles" ON public.profiles FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'staff')
);

CREATE POLICY "Clients View Own Profile" ON public.profiles FOR SELECT TO authenticated USING (
    id = auth.uid()
);

-- Client Isolation for Projects: Clients can only see projects linked to them
CREATE POLICY "Clients Access Own Projects" ON public.projects FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid() OR email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'staff')
);

-- Client Isolation for Invoices: Clients can only see their own invoices
CREATE POLICY "Clients Access Own Invoices" ON public.invoices FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid() OR email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'staff')
);

-- Client Isolation for Documents: Clients can only view documents in their vault
CREATE POLICY "Clients Access Own Documents" ON public.documents FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid() OR email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'staff')
);

-- Public read for published services, portfolio, and FAQs
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Published Services" ON public.services FOR SELECT TO anon, authenticated USING (is_published = true);

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Published Portfolio" ON public.portfolio_projects FOR SELECT TO anon, authenticated USING (is_published = true);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Published FAQs" ON public.faqs FOR SELECT TO anon, authenticated USING (is_published = true);
