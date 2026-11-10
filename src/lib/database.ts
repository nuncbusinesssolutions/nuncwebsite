import {
  Inquiry,
  ClientRecord,
  Project,
  ProjectTask,
  Appointment,
  Quotation,
  Invoice,
  PaymentRecord,
  DocumentItem,
  Conversation,
  ChatMessage,
  ServiceItem,
  PortfolioItem,
  FAQItem,
  TestimonialItem,
  LegalPage,
  WebsiteCMS,
  Department,
  StaffMember,
  IntegrationSettings,
  SystemNotification,
} from './types';

const STORAGE_KEY = 'nunc_business_solutions_db_v1';

// Initial 10 Services
const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Custom Business Management Systems',
    slug: 'custom-business-management-systems',
    shortDescription: 'Tailored enterprise ERP, operations software, and centralized back-office systems designed specifically for your organization.',
    detailedInfo: 'We engineer end-to-end bespoke management systems tailored to your unique operational pipelines, eliminating spreadsheet sprawl and disconnected software.',
    benefits: [
      'Eliminate duplicate data entry across departments',
      'Real-time executive oversight and operational analytics',
      'Role-based security and granular audit trails',
      'Seamless multi-branch and multi-warehouse synchronization'
    ],
    features: [
      'Bespoke workflow architecture and business logic',
      'Role-based access control (RBAC) and user hierarchies',
      'Automated approval matrices and managerial escalations',
      'Custom report generation and automated ledger reconciliations'
    ],
    imageUrl: '/src/assets/images/service_custom_software_1794241102194.jpg',
    displayOrder: 1,
    isPublished: true,
    serviceFaqs: [
      { question: 'Can this replace our legacy Excel sheets and accounting software?', answer: 'Yes. We build custom migration pipelines to import your existing historical data securely into a unified PostgreSQL-backed database.' },
      { question: 'How long does a custom ERP project typically take?', answer: 'Standard deployments range from 6 to 16 weeks depending on operational scope, integrations, and customization.' }
    ]
  },
  {
    id: 'srv-2',
    name: 'Website Development',
    slug: 'website-development',
    shortDescription: 'High-performance, secure, and conversion-engineered corporate websites crafted for scalable enterprises and brands.',
    detailedInfo: 'Modern corporate web presences built with modern architectural speed, strict accessibility standards, search engine optimization, and custom CMS capabilities.',
    benefits: [
      'Sub-second page loading speeds and high Core Web Vitals scores',
      'Responsive multi-device layout integrity across desktop, tablet, and mobile',
      'Enterprise security without vulnerable third-party plugin bloat',
      'Independent content management without requiring code changes'
    ],
    features: [
      'React & TypeScript frontend architecture',
      'Integrated Content Management System (CMS)',
      'Structured Schema.org JSON-LD and OpenGraph cards',
      'Direct CRM and lead capture integration'
    ],
    imageUrl: '/src/assets/images/hero_corporate_tech_1794241101462.jpg',
    displayOrder: 2,
    isPublished: true,
    serviceFaqs: [
      { question: 'Will our staff be able to edit page copy and images?', answer: 'Yes. You receive full access to our customized Admin CMS where you can modify hero copy, services, FAQs, and legal policies.' }
    ]
  },
  {
    id: 'srv-3',
    name: 'Web Application Development',
    slug: 'web-application-development',
    shortDescription: 'Robust, scalable cloud applications, customer portals, and internal productivity platforms built with modern TypeScript.',
    detailedInfo: 'We architect and build full-stack web applications with enterprise data persistence, real-time synchronization, and multi-tenant isolation.',
    benefits: [
      'Highly responsive single-page applications with real-time updates',
      'Strict database security with Row Level Security (RLS)',
      'Automated CI/CD pipelines with zero-downtime deployment',
      'Multi-currency and multi-timezone native handling'
    ],
    features: [
      'Interactive client portals with document vaults',
      'Real-time messaging and notifications',
      'Automated background jobs and transactional workflows',
      'Comprehensive REST and GraphQL API endpoints'
    ],
    imageUrl: '/src/assets/images/service_custom_software_1794241102194.jpg',
    displayOrder: 3,
    isPublished: true,
    serviceFaqs: [
      { question: 'Do we own the full source code and database?', answer: 'Yes. Upon project completion and handover, your organization receives full repository ownership and master database credentials.' }
    ]
  },
  {
    id: 'srv-4',
    name: 'AI Chatbots & AI Integration',
    slug: 'ai-chatbots-and-ai-integration',
    shortDescription: 'Intelligent conversational agents, custom document intelligence, and predictive automation for customer inquiries and operations.',
    detailedInfo: 'Harness practical, privacy-compliant AI to automate repetitive customer service inquiries, summarize technical documents, and accelerate workflows.',
    benefits: [
      '24/7 instant response to inquiries with strict guardrails',
      'Reduced tier-1 customer support ticket volume by up to 60%',
      'Automated inquiry triage, categorization, and department routing',
      'Complete data sovereignty with private enterprise context'
    ],
    features: [
      'Domain-grounded retrieval-augmented generation (RAG)',
      'Seamless human agent fallback and live handoff',
      'Omnichannel integration across Website Chat, Messenger, and WhatsApp',
      'Detailed conversation analytics and sentiment tracking'
    ],
    imageUrl: '/src/assets/images/service_automation_ai_1794241102020.jpg',
    displayOrder: 4,
    isPublished: true,
    serviceFaqs: [
      { question: 'Can the AI chatbot answer questions about our specific products?', answer: 'Yes, we ground the assistant strictly on your company documentation, product catalogs, and service guidelines.' }
    ]
  },
  {
    id: 'srv-5',
    name: 'Point of Sale (POS) Systems',
    slug: 'point-of-sale-pos-systems',
    shortDescription: 'Fast, dependable cloud and offline-ready POS systems for retail, dining, and multi-location commercial counters.',
    detailedInfo: 'Engineered for rapid cashier operations, barcode scanning, split billing, multi-payment terminals (GCash, Maya, Cards), and real-time inventory deductions.',
    benefits: [
      'Rapid checkout workflows with sub-second transaction processing',
      'Hardware support for thermal printers, barcode scanners, and cash drawers',
      'Live cash drawer auditing and shift reconciliation',
      'Integrated multi-payment QR support for Philippine e-wallets'
    ],
    features: [
      'Cloud inventory sync with offline-first local resiliency',
      'Multiple payment methods including GCash, Maya, and credit cards',
      'Configurable VAT and non-VAT compliance receipt printing',
      'Cashier permissions, shift tracking, and petty cash logs'
    ],
    imageUrl: '/src/assets/images/portfolio_pos_travel_1794241104986.jpg',
    displayOrder: 5,
    isPublished: true,
    serviceFaqs: [
      { question: 'Does the POS work if the internet connection drops?', answer: 'Yes. Our POS architecture queues sales transactions locally and synchronizes automatically once connectivity is restored.' }
    ]
  },
  {
    id: 'srv-6',
    name: 'Inventory & Sales Management',
    slug: 'inventory-and-sales-management',
    shortDescription: 'Accurate stock tracking, warehouse allocation, automated reorder thresholds, and sales order fulfillment.',
    detailedInfo: 'Gain complete visibility over stock across multiple physical warehouses, track batch numbers, expiration dates, supplier purchase orders, and customer invoices.',
    benefits: [
      'Prevent stockouts and overstock with automated reorder alerts',
      'Multi-warehouse and consignment inventory visibility in real time',
      'Accurate cost of goods sold (COGS) and gross margin calculations',
      'Audit logs for stock adjustments, transfers, and write-offs'
    ],
    features: [
      'SKU and barcode generation with batch tracking',
      'Supplier purchase order and goods received note (GRN) workflows',
      'Automated sales order reservation and shipping dispatch',
      'Comprehensive inventory valuation reports (FIFO / Weighted Average)'
    ],
    imageUrl: '/src/assets/images/portfolio_enterprise_erp_1794241102994.jpg',
    displayOrder: 6,
    isPublished: true,
    serviceFaqs: [
      { question: 'Can we manage multiple store branches under one account?', answer: 'Yes. The system supports multi-location stock transfers, inter-branch requests, and unified reporting.' }
    ]
  },
  {
    id: 'srv-7',
    name: 'Travel & Tours Management Systems',
    slug: 'travel-and-tours-management-systems',
    shortDescription: 'Complete booking engines, itinerary builders, tour package management, and passenger manifest automation.',
    detailedInfo: 'Purpose-built for travel agencies and tour operators to manage multi-day packages, hotel allocations, vehicle logistics, customer vouchers, and automated billing.',
    benefits: [
      'Instant digital vouchers and itinerary PDF generation for clients',
      'All-in-one management of flights, hotels, tours, and private transfers',
      'Automated payment milestone tracking (down payment, final balance)',
      'Passenger manifest exports for coast guard, airlines, and tour guides'
    ],
    features: [
      'Interactive itinerary builder with cost break-downs',
      'Customizable booking inquiry forms with automated quotation generation',
      'Integrated customer portal for travel voucher and receipt downloads',
      'Supplier payable tracking and profit margin monitoring'
    ],
    imageUrl: '/src/assets/images/portfolio_pos_travel_1794241104986.jpg',
    displayOrder: 7,
    isPublished: true,
    serviceFaqs: [
      { question: 'Can clients view and download their travel vouchers online?', answer: 'Yes. Clients receive their own secure portal login to view itineraries, download PDF vouchers, and upload payment receipts.' }
    ]
  },
  {
    id: 'srv-8',
    name: 'E-commerce Development',
    slug: 'ecommerce-development',
    shortDescription: 'Custom, high-conversion online storefronts with payment gateway integrations, shipping logistics, and customer portals.',
    detailedInfo: 'Modern e-commerce solutions built for brands that need custom checkout logic, localized Philippine payment gateways (GCash, Maya, Dragonpay), and courier sync.',
    benefits: [
      'Zero monthly platform commission fees on your gross merchandise value',
      'Lightning-fast checkout optimized for mobile shoppers',
      'Direct automated sync with your warehouse inventory system',
      'Comprehensive customer order tracking and re-ordering'
    ],
    features: [
      'Seamless GCash, Maya, card, and bank transfer checkout',
      'Shipping fee calculators with courier API readiness',
      'Discount codes, seasonal campaigns, and wholesale tiered pricing',
      'Abandoned checkout recovery and customer notification triggers'
    ],
    imageUrl: '/src/assets/images/service_custom_software_1794241102194.jpg',
    displayOrder: 8,
    isPublished: true,
    serviceFaqs: [
      { question: 'Which payment gateways can we use?', answer: 'We integrate with verified regional payment gateways such as PayMongo, Xendit, and direct bank QR systems.' }
    ]
  },
  {
    id: 'srv-9',
    name: 'Business Process Automation',
    slug: 'business-process-automation',
    shortDescription: 'Streamline repetitive manual tasks, document approvals, spreadsheet synchronization, and cross-platform integrations.',
    detailedInfo: 'Eliminate human bottlenecks by connecting your software tools, automating notification workflows, generating recurring invoices, and syncing databases.',
    benefits: [
      'Save hundreds of staff hours per month on manual data copy-pasting',
      'Reduce human error in calculations, billing, and document preparation',
      'Accelerate customer turnaround times from days to minutes',
      'Centralized event logs and automatic failure alerts'
    ],
    features: [
      'Custom webhook routers and background job processing',
      'Automated email and SMS notification triggers',
      'Automated PDF invoice generation and reconciliation',
      'Multi-system data synchronization (CRM, Accounting, Storage)'
    ],
    imageUrl: '/src/assets/images/service_automation_ai_1794241102020.jpg',
    displayOrder: 9,
    isPublished: true,
    serviceFaqs: [
      { question: 'Can you connect with our existing third-party systems?', answer: 'Yes, we build secure API connectors to integrate with modern webhooks and external enterprise databases.' }
    ]
  },
  {
    id: 'srv-10',
    name: 'Customer Relationship Management (CRM)',
    slug: 'customer-relationship-management-crm',
    shortDescription: 'Centralize sales pipelines, track client communication histories, manage quotations, and boost conversion rates.',
    detailedInfo: 'A tailored CRM built for high-touch B2B and service enterprises. Manage leads from initial inquiry to signed contract, with full interaction histories.',
    benefits: [
      'Complete visibility of your sales team pipeline and deal stages',
      'Never lose track of a potential client inquiry or follow-up deadline',
      'Integrated quotation generation with 1-click conversion to project',
      'Detailed client lifetime value and historical billing records'
    ],
    features: [
      'Visual deal stage boards and custom sales pipelines',
      'Omnichannel client conversation timeline (Email, Chat, Notes)',
      'Automated follow-up reminders and task assignments',
      'Executive revenue forecasting and staff performance tracking'
    ],
    imageUrl: '/src/assets/images/hero_corporate_tech_1794241101462.jpg',
    displayOrder: 10,
    isPublished: true,
    serviceFaqs: [
      { question: 'Is the CRM integrated with the Client Portal?', answer: 'Yes. Inquiries submitted on the website appear in the CRM immediately and can be converted into active Client Portal accounts.' }
    ]
  }
];

// Initial Demonstration Projects (Clearly labeled DEMO PROJECT or CONCEPT PROJECT)
const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'CloudERP Enterprise Operations Suite',
    slug: 'clouderp-enterprise-suite',
    category: 'Custom Business Management Systems',
    shortDescription: 'Centralized ERP architecture managing supply chain, multi-branch warehouses, procurement approvals, and executive financial ledgers.',
    fullDescription: 'A comprehensive enterprise resource planning system architecture designed for multi-location manufacturing and distribution businesses. Demonstrates unified stock ledger management, approval hierarchies, and role-based access control.',
    thumbnailUrl: '/src/assets/images/portfolio_enterprise_erp_1794241102994.jpg',
    demoLabel: 'DEMO PROJECT',
    tags: ['ERP', 'PostgreSQL', 'Multi-Warehouse', 'Approval Workflows'],
    isPublished: true,
    displayOrder: 1
  },
  {
    id: 'port-2',
    title: 'RetailPulse POS & Omnichannel Commerce',
    slug: 'retailpulse-pos-system',
    category: 'Point of Sale (POS) Systems',
    shortDescription: 'High-speed touch-screen POS terminal with integrated barcode scanning, GCash/Maya QR payments, and cloud inventory deduction.',
    fullDescription: 'Demonstration architecture of a high-throughput point-of-sale system featuring offline-first local queueing, cashier shift balancing, and receipt printing with compliance tax configurations.',
    thumbnailUrl: '/src/assets/images/portfolio_pos_travel_1794241104986.jpg',
    demoLabel: 'DEMO PROJECT',
    tags: ['POS', 'Offline Resilient', 'GCash/Maya Ready', 'Barcode Scanner'],
    isPublished: true,
    displayOrder: 2
  },
  {
    id: 'port-3',
    title: 'VoyageDesk Travel & Tour Booking Platform',
    slug: 'voyagedesk-travel-management',
    category: 'Travel & Tours Management Systems',
    shortDescription: 'Interactive itinerary builder, guest manifest generator, and automated quotation and voucher dispatch for tour operators.',
    fullDescription: 'Concept showcase demonstrating passenger booking management, automated payment milestone schedules (initial down payment, mid-milestone, final balance), and self-service travel voucher downloads.',
    thumbnailUrl: '/src/assets/images/portfolio_pos_travel_1794241104986.jpg',
    demoLabel: 'CONCEPT PROJECT',
    tags: ['Travel Management', 'Itinerary Builder', 'Client Portal', 'Voucher PDF'],
    isPublished: true,
    displayOrder: 3
  },
  {
    id: 'port-4',
    title: 'AutoFlow Intelligent Business Automation',
    slug: 'autoflow-business-automation',
    category: 'Business Process Automation',
    shortDescription: 'Event-driven automation pipeline coordinating invoice issuance, payment verification webhooks, and client status notifications.',
    fullDescription: 'Demonstration implementation of server-authoritative webhook processing, document generation, and transactional email distribution for modern B2B service firms.',
    thumbnailUrl: '/src/assets/images/service_automation_ai_1794241102020.jpg',
    demoLabel: 'DEMO PROJECT',
    tags: ['Automation', 'Webhooks', 'Transaction Pipelines', 'Notification Engine'],
    isPublished: true,
    displayOrder: 4
  }
];

// Initial Categorized FAQs
const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do we request a project quotation?',
    answer: 'You can submit your project requirements through our Contact & Inquiry form or request a consultation meeting. Our team will review your specifications, budget parameters, and timeline, then prepare a formal proposal and itemized quotation.',
    category: 'Quotations',
    displayOrder: 1,
    isPublished: true
  },
  {
    id: 'faq-2',
    question: 'Do you offer fixed pricing or customized project quotations?',
    answer: 'We provide inquiry-based, customized quotations tailored to the specific business scope, technical complexity, and operational workflows of each client. This ensures you only pay for the precise features and infrastructure your enterprise requires.',
    category: 'Quotations',
    displayOrder: 2,
    isPublished: true
  },
  {
    id: 'faq-3',
    question: 'What currencies do you support for billing and contracts?',
    answer: 'We support Philippine Peso (PHP) for local businesses and US Dollar (USD) for international clients. Each quotation, invoice, and payment schedule is explicitly maintained in the client’s designated currency without misleading cross-currency conversions.',
    category: 'Payments',
    displayOrder: 3,
    isPublished: true
  },
  {
    id: 'faq-4',
    question: 'What payment methods can we use to pay invoices?',
    answer: 'We accept corporate bank transfers, GCash, Maya, and credit/debit card payments through our secure invoicing system. Clients can also upload payment proofs directly in their Client Portal for instant verification.',
    category: 'Payments',
    displayOrder: 4,
    isPublished: true
  },
  {
    id: 'faq-5',
    question: 'How does project payment scheduling work?',
    answer: 'We configure flexible payment schedules per project. A standard arrangement is typically 30% initial down payment upon contract signing, 40% mid-development milestone, and 30% upon final acceptance testing and deployment.',
    category: 'Project Development',
    displayOrder: 5,
    isPublished: true
  },
  {
    id: 'faq-6',
    question: 'Do we get full access to the source code and database upon project completion?',
    answer: 'Yes. Upon complete project delivery and settlement, full repository access, administrative credentials, and database rights are handed over to your organization, accompanied by deployment documentation.',
    category: 'Project Development',
    displayOrder: 6,
    isPublished: true
  },
  {
    id: 'faq-7',
    question: 'What is the difference between Online and In-Person Consultations?',
    answer: 'Online consultations are conducted via Google Meet or Zoom for rapid alignment, while In-Person consultations are scheduled at designated meeting spaces or company offices for in-depth technical discovery and enterprise workshops.',
    category: 'Consultations',
    displayOrder: 7,
    isPublished: true
  },
  {
    id: 'faq-8',
    question: 'How do clients track their active projects and download deliverables?',
    answer: 'Clients receive credentials to our secure Client Portal where they can monitor project milestone progress, review task updates, communicate directly with assigned project managers, and download approved proposals, invoices, and deliverables.',
    category: 'Client Support',
    displayOrder: 8,
    isPublished: true
  }
];

// Initial Departments
const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Executive & Strategy', description: 'Overall enterprise governance, business operations, and architectural oversight', staffCount: 1 },
  { id: 'dept-2', name: 'Software Engineering', description: 'Full-stack software development, database architecture, and security hardening', staffCount: 1 },
  { id: 'dept-3', name: 'Client Success & Support', description: 'Inquiry consultation, client onboarding, and ongoing technical support', staffCount: 1 },
  { id: 'dept-4', name: 'Finance & Accounts', description: 'Quotation drafting, invoicing, payment verification, and financial reporting', staffCount: 1 },
  { id: 'dept-5', name: 'Operations & Delivery', description: 'Project management, milestone delivery, and quality assurance', staffCount: 1 }
];

// Initial Staff Members
const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    userId: 'usr-admin-1',
    fullName: 'NUNC Super Administrator',
    email: 'admin@nuncbusinesssolutions.ph',
    phone: '09161669188',
    departmentId: 'dept-1',
    position: 'Chief Executive & Lead Architect',
    role: 'super_admin',
    status: 'active',
    assignedInquiriesCount: 2,
    activeProjectsCount: 2,
    completedTasksCount: 14,
    pendingTasksCount: 3,
    performanceNotes: 'Super Administrator account with complete system and CMS authority.'
  },
  {
    id: 'staff-2',
    userId: 'usr-staff-2',
    fullName: 'Carl Mendoza',
    email: 'staff.carl@nuncbusinesssolutions.ph',
    phone: '09175551234',
    departmentId: 'dept-2',
    position: 'Senior Full-Stack Engineer',
    role: 'staff',
    status: 'active',
    assignedInquiriesCount: 1,
    activeProjectsCount: 2,
    completedTasksCount: 22,
    pendingTasksCount: 4,
    performanceNotes: 'Specializes in custom business management systems and Supabase RLS integration.'
  },
  {
    id: 'staff-3',
    userId: 'usr-staff-3',
    fullName: 'Patricia Santos',
    email: 'staff.patricia@nuncbusinesssolutions.ph',
    phone: '09187779876',
    departmentId: 'dept-3',
    position: 'Client Relations & Inquiry Manager',
    role: 'staff',
    status: 'active',
    assignedInquiriesCount: 3,
    activeProjectsCount: 1,
    completedTasksCount: 18,
    pendingTasksCount: 2,
    performanceNotes: 'Manages incoming business inquiries, discovery consultations, and quotations.'
  }
];

// Initial Inquiries
const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-101',
    referenceNumber: 'NUNC-2026-INQ-001',
    fullName: 'David Ramos',
    businessName: 'Apex Logistics Corporation',
    email: 'david.ramos@apexlogistics.ph',
    phone: '09171234567',
    serviceId: 'srv-1',
    serviceName: 'Custom Business Management Systems',
    budgetRange: '₱250,000 - ₱500,000',
    requirements: 'We require a centralized fleet dispatch and warehouse inventory management system with real-time driver tracking and automated client billings.',
    preferredContact: 'email',
    status: 'approved',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'NUNC Super Administrator',
    createdAt: '2026-11-01T09:30:00Z',
    updatedAt: '2026-11-02T14:20:00Z',
    statusNotes: 'Requirements aligned. Proceeding with formal quotation preparation.'
  },
  {
    id: 'inq-102',
    referenceNumber: 'NUNC-2026-INQ-002',
    fullName: 'Elena Reyes',
    businessName: 'Solana Resorts & Island Tours',
    email: 'elena@solanaresorts.com',
    phone: '09189876543',
    serviceId: 'srv-7',
    serviceName: 'Travel & Tours Management Systems',
    budgetRange: '₱150,000 - ₱300,000',
    requirements: 'Online booking engine for 3 island tour packages with automated guest manifest generation and GCash down payment collection.',
    preferredContact: 'meeting',
    status: 'converted',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Patricia Santos',
    clientId: 'cli-solana',
    createdAt: '2026-11-03T11:15:00Z',
    updatedAt: '2026-11-05T16:00:00Z',
    statusNotes: 'Successfully converted into active project PRJ-2026-02.'
  },
  {
    id: 'inq-103',
    referenceNumber: 'NUNC-2026-INQ-003',
    fullName: 'Marcus Vance',
    businessName: 'Vance Dental Specialty Clinics',
    email: 'marcus@vancedental.com',
    phone: '09165558901',
    serviceId: 'srv-5',
    serviceName: 'Point of Sale (POS) Systems',
    budgetRange: '₱100,000 - ₱200,000',
    requirements: 'Multi-branch clinic POS with treatment package billing, dentist commission tracking, and inventory deduction for dental supplies.',
    preferredContact: 'phone',
    status: 'under_review',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Carl Mendoza',
    createdAt: '2026-11-08T08:45:00Z',
    updatedAt: '2026-11-08T10:00:00Z',
    statusNotes: 'Technical team reviewing clinic inventory workflow specifics.'
  }
];

// Initial Client Records
const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: 'cli-solana',
    userId: 'usr-client-solana',
    fullName: 'Elena Reyes',
    businessName: 'Solana Resorts & Island Tours',
    email: 'client.solana@example.com',
    phone: '09189876543',
    address: 'Brgy. Buena Suerte, El Nido, Palawan',
    totalBilledPhp: 280000,
    totalPaidPhp: 84000,
    totalBilledUsd: 0,
    totalPaidUsd: 0,
    activeProjectsCount: 1,
    createdAt: '2026-11-05T16:00:00Z'
  },
  {
    id: 'cli-apex',
    userId: 'usr-client-apex',
    fullName: 'David Ramos',
    businessName: 'Apex Logistics Corporation',
    email: 'client.acme@example.com',
    phone: '09171234567',
    address: 'BGC Corporate Center, Taguig City, Metro Manila',
    totalBilledPhp: 450000,
    totalPaidPhp: 135000,
    totalBilledUsd: 0,
    totalPaidUsd: 0,
    activeProjectsCount: 1,
    createdAt: '2026-11-02T14:30:00Z'
  }
];

// Initial Projects
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    projectCode: 'NUNC-PRJ-2026-01',
    title: 'Apex Fleet & Logistics ERP System',
    description: 'Custom dispatch and warehouse inventory platform with real-time shipment status, proof-of-delivery uploads, and driver payout reconciliation.',
    clientId: 'cli-apex',
    clientName: 'David Ramos',
    clientBusiness: 'Apex Logistics Corporation',
    managerStaffId: 'staff-2',
    managerStaffName: 'Carl Mendoza',
    serviceCategory: 'Custom Business Management Systems',
    status: 'in_progress',
    progressPercentage: 45,
    budgetTotal: 450000,
    currency: 'PHP',
    startDate: '2026-11-03',
    targetEndDate: '2026-12-20',
    detailedTrackingEnabled: true,
    milestones: [
      { id: 'm-1', projectId: 'prj-1', title: 'Phase 1: Architecture, Wireframing & Database Schema', description: 'Database schema modeling, ERD approval, and core UI wireframes.', percentageWeight: 30, dueDate: '2026-11-12', status: 'completed', amount: 135000, currency: 'PHP', isPaid: true },
      { id: 'm-2', projectId: 'prj-1', title: 'Phase 2: Fleet Dispatch & Warehouse Module Implementation', description: 'Core functional development of dispatch board and stock tracking.', percentageWeight: 40, dueDate: '2026-12-02', status: 'in_progress', amount: 180000, currency: 'PHP', isPaid: false },
      { id: 'm-3', projectId: 'prj-1', title: 'Phase 3: Integration, UAT & Handover', description: 'End-to-end user acceptance testing, staff training, and master deployment.', percentageWeight: 30, dueDate: '2026-12-20', status: 'pending', amount: 135000, currency: 'PHP', isPaid: false }
    ],
    createdAt: '2026-11-03T10:00:00Z',
    updatedAt: '2026-11-08T15:30:00Z'
  },
  {
    id: 'prj-2',
    projectCode: 'NUNC-PRJ-2026-02',
    title: 'Solana Island Tour Booking Platform',
    description: 'Bespoke web reservation system with instant package availability, voucher generation, and GCash/Maya payment integrations.',
    clientId: 'cli-solana',
    clientName: 'Elena Reyes',
    clientBusiness: 'Solana Resorts & Island Tours',
    managerStaffId: 'staff-1',
    managerStaffName: 'NUNC Super Administrator',
    serviceCategory: 'Travel & Tours Management Systems',
    status: 'planning',
    progressPercentage: 20,
    budgetTotal: 280000,
    currency: 'PHP',
    startDate: '2026-11-06',
    targetEndDate: '2026-12-15',
    detailedTrackingEnabled: true,
    milestones: [
      { id: 'm-4', projectId: 'prj-2', title: 'Phase 1: Initial Discovery & Down Payment', description: 'Contract execution, technical scope lock, and initial down payment.', percentageWeight: 30, dueDate: '2026-11-10', status: 'completed', amount: 84000, currency: 'PHP', isPaid: true },
      { id: 'm-5', projectId: 'prj-2', title: 'Phase 2: Booking Engine & Payment Gateway Hookup', description: 'Front-facing reservation portal and payment gateway webhooks.', percentageWeight: 40, dueDate: '2026-11-28', status: 'pending', amount: 112000, currency: 'PHP', isPaid: false },
      { id: 'm-6', projectId: 'prj-2', title: 'Phase 3: Voucher Generation & Final Launch', description: 'Automated PDF voucher dispatch and live production launch.', percentageWeight: 30, dueDate: '2026-12-15', status: 'pending', amount: 84000, currency: 'PHP', isPaid: false }
    ],
    createdAt: '2026-11-06T14:00:00Z',
    updatedAt: '2026-11-07T11:20:00Z'
  }
];

// Initial Tasks
const INITIAL_TASKS: ProjectTask[] = [
  {
    id: 'tsk-1',
    projectId: 'prj-1',
    title: 'Model PostgreSQL schema for multi-warehouse inventory',
    description: 'Design normalized tables for warehouse bins, stock batch tracking, and adjustment audit logs with foreign key constraints.',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Carl Mendoza',
    priority: 'high',
    status: 'completed',
    dueDate: '2026-11-10',
    subtasks: [
      { id: 'st-1', title: 'Draft schema DDL in migrations', completed: true },
      { id: 'st-2', title: 'Review indexing on warehouse_id and sku', completed: true },
      { id: 'st-3', title: 'Setup RLS policies for tenant isolation', completed: true }
    ],
    internalComments: [
      { id: 'c-1', author: 'Carl Mendoza', text: 'Schema finalized with UUID primary keys and composite indexes.', date: '2026-11-08' }
    ],
    createdAt: '2026-11-04T08:00:00Z'
  },
  {
    id: 'tsk-2',
    projectId: 'prj-1',
    title: 'Implement dispatch assignment interface with live filtering',
    description: 'Build driver queue list with status chips, route distance estimates, and consignment confirmation triggers.',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Carl Mendoza',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: '2026-11-18',
    subtasks: [
      { id: 'st-4', title: 'Build driver card components', completed: true },
      { id: 'st-5', title: 'Integrate real-time status subscription', completed: false },
      { id: 'st-6', title: 'Add assignment validation alerts', completed: false }
    ],
    internalComments: [],
    createdAt: '2026-11-06T09:00:00Z'
  },
  {
    id: 'tsk-3',
    projectId: 'prj-2',
    title: 'Configure GCash and Maya webhook handlers for Solana reservation down payments',
    description: 'Ensure server-side signature validation and idempotent payment receipt storage.',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'NUNC Super Administrator',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-11-20',
    subtasks: [
      { id: 'st-7', title: 'Implement webhook HMAC verification', completed: false },
      { id: 'st-8', title: 'Test partial down-payment confirmation event', completed: false }
    ],
    internalComments: [],
    createdAt: '2026-11-07T10:00:00Z'
  }
];

// Initial Appointments (with prevention of double-booking)
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    referenceNumber: 'NUNC-APT-2026-001',
    clientName: 'David Ramos',
    clientEmail: 'david.ramos@apexlogistics.ph',
    clientPhone: '09171234567',
    businessName: 'Apex Logistics Corporation',
    serviceInterestedIn: 'Custom Business Management Systems',
    type: 'online',
    meetingPlatform: 'Google Meet',
    meetingLink: 'https://meet.google.com/nunc-apex-arch',
    date: '2026-11-11',
    timeSlot: '10:00 AM - 11:00 AM',
    timeZone: 'Asia/Manila (GMT+8)',
    requirements: 'Review of Phase 2 dispatch board mockups and database integration checkpoints.',
    status: 'confirmed',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Carl Mendoza',
    adminNotes: 'Confirmed with client. Meeting link shared.',
    createdAt: '2026-11-05T10:00:00Z'
  },
  {
    id: 'apt-2',
    referenceNumber: 'NUNC-APT-2026-002',
    clientName: 'Regina Lim',
    clientEmail: 'regina@luminafashions.com',
    clientPhone: '09168882233',
    businessName: 'Lumina Apparel Group',
    serviceInterestedIn: 'E-commerce Development',
    type: 'in_person',
    locationAddress: 'NUNC Partner Meeting Suite, BGC, Taguig City, Metro Manila',
    date: '2026-11-13',
    timeSlot: '02:00 PM - 03:00 PM',
    timeZone: 'Asia/Manila (GMT+8)',
    requirements: 'Discussion on wholesale bulk ordering portal with tiered B2B credit accounts.',
    status: 'confirmed',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Patricia Santos',
    adminNotes: 'Conference room booked for 2 PM.',
    createdAt: '2026-11-07T14:30:00Z'
  }
];

// Initial Quotations
const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'qt-1',
    quotationNumber: 'NUNC-QT-2026-001',
    clientId: 'cli-apex',
    clientName: 'David Ramos',
    clientBusiness: 'Apex Logistics Corporation',
    clientEmail: 'david.ramos@apexlogistics.ph',
    projectTitle: 'Apex Fleet & Logistics ERP System',
    currency: 'PHP',
    items: [
      { id: 'qi-1', description: 'Phase 1: Architecture, ERD Database Design & Security Specification', quantity: 1, unitPrice: 135000, discount: 0, amount: 135000 },
      { id: 'qi-2', description: 'Phase 2: Fleet Dispatching & Multi-Warehouse Inventory System', quantity: 1, unitPrice: 180000, discount: 0, amount: 180000 },
      { id: 'qi-3', description: 'Phase 3: Integration, UAT, Deployment & 90-Day Technical Warranty', quantity: 1, unitPrice: 135000, discount: 0, amount: 135000 }
    ],
    subtotal: 450000,
    taxRate: 12,
    taxAmount: 54000,
    discountTotal: 0,
    total: 504000,
    status: 'accepted',
    validUntil: '2026-12-01',
    paymentTerms: '30% Upon Signing, 40% Mid-Development, 30% Upon Final UAT & Handover',
    notes: 'Includes complete source code handover and 3 months of priority post-deployment support.',
    createdAt: '2026-11-02T16:00:00Z'
  }
];

// Initial Invoices
const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'NUNC-INV-2026-001',
    clientId: 'cli-apex',
    clientName: 'David Ramos',
    clientBusiness: 'Apex Logistics Corporation',
    clientEmail: 'david.ramos@apexlogistics.ph',
    projectId: 'prj-1',
    projectTitle: 'Apex Fleet & Logistics ERP System',
    currency: 'PHP',
    items: [
      { id: 'ii-1', description: 'Initial Down Payment (30% Milestone) - Architecture & Database Foundation', quantity: 1, unitPrice: 135000, discount: 0, amount: 135000 }
    ],
    subtotal: 135000,
    taxRate: 12,
    taxAmount: 16200,
    discountTotal: 0,
    total: 151200,
    amountPaid: 151200,
    balanceDue: 0,
    status: 'paid',
    issueDate: '2026-11-03',
    dueDate: '2026-11-10',
    paymentInstructions: 'Bank Transfer to NUNC Business Solutions BDO / BPI Account. Reference invoice number on deposit slip.',
    notes: 'Down payment verified. Work started on November 3, 2026.',
    createdAt: '2026-11-03T11:00:00Z'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'NUNC-INV-2026-002',
    clientId: 'cli-solana',
    clientName: 'Elena Reyes',
    clientBusiness: 'Solana Resorts & Island Tours',
    clientEmail: 'elena@solanaresorts.com',
    projectId: 'prj-2',
    projectTitle: 'Solana Island Tour Booking Platform',
    currency: 'PHP',
    items: [
      { id: 'ii-2', description: 'Initial Down Payment (30% Milestone) - Booking Engine Architecture', quantity: 1, unitPrice: 84000, discount: 0, amount: 84000 }
    ],
    subtotal: 84000,
    taxRate: 12,
    taxAmount: 10080,
    discountTotal: 0,
    total: 94080,
    amountPaid: 94080,
    balanceDue: 0,
    status: 'paid',
    issueDate: '2026-11-06',
    dueDate: '2026-11-13',
    paymentInstructions: 'Direct GCash / Maya corporate QR or Bank Transfer.',
    notes: 'Payment verified on November 7, 2026.',
    createdAt: '2026-11-06T15:00:00Z'
  }
];

// Initial Payment Records
const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    paymentReference: 'NUNC-PAY-2026-001',
    invoiceId: 'inv-1',
    invoiceNumber: 'NUNC-INV-2026-001',
    projectId: 'prj-1',
    projectTitle: 'Apex Fleet & Logistics ERP System',
    clientId: 'cli-apex',
    clientName: 'David Ramos',
    amount: 151200,
    currency: 'PHP',
    paymentDate: '2026-11-04',
    method: 'bank_transfer',
    transactionReference: 'BDO-REF-99882211',
    proofUrl: 'https://placehold.co/600x400/png?text=Bank+Deposit+Slip+Proof',
    verificationStatus: 'verified',
    verifiedByStaffId: 'staff-1',
    verifiedAt: '2026-11-04T16:30:00Z',
    notes: 'Official BDO interbank transfer verified by finance department.',
    createdAt: '2026-11-04T14:00:00Z'
  },
  {
    id: 'pay-2',
    paymentReference: 'NUNC-PAY-2026-002',
    invoiceId: 'inv-2',
    invoiceNumber: 'NUNC-INV-2026-002',
    projectId: 'prj-2',
    projectTitle: 'Solana Island Tour Booking Platform',
    clientId: 'cli-solana',
    clientName: 'Elena Reyes',
    amount: 94080,
    currency: 'PHP',
    paymentDate: '2026-11-07',
    method: 'gcash',
    transactionReference: 'GCASH-TXN-445588',
    proofUrl: 'https://placehold.co/600x400/png?text=GCash+Receipt+Screenshot',
    verificationStatus: 'verified',
    verifiedByStaffId: 'staff-1',
    verifiedAt: '2026-11-07T12:00:00Z',
    notes: 'GCash corporate transfer verified.',
    createdAt: '2026-11-07T11:45:00Z'
  }
];

// Initial Documents
const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'NUNC-QT-2026-001 Formal Proposal & Quotation.pdf',
    category: 'proposals',
    fileName: 'Apex_Logistics_ERP_Proposal_NUNC.pdf',
    fileSize: '1.4 MB',
    fileUrl: '#download-proposal',
    clientId: 'cli-apex',
    clientName: 'David Ramos',
    projectId: 'prj-1',
    uploadedBy: 'NUNC Super Administrator',
    uploadedAt: '2026-11-02T16:15:00Z',
    isPrivate: true
  },
  {
    id: 'doc-2',
    title: 'Service Agreement & Master Contract (Signed).pdf',
    category: 'contracts',
    fileName: 'Apex_Logistics_Signed_Contract.pdf',
    fileSize: '2.1 MB',
    fileUrl: '#download-contract',
    clientId: 'cli-apex',
    clientName: 'David Ramos',
    projectId: 'prj-1',
    uploadedBy: 'NUNC Super Administrator',
    uploadedAt: '2026-11-03T09:00:00Z',
    isPrivate: true
  },
  {
    id: 'doc-3',
    title: 'Official Invoice NUNC-INV-2026-001 (Paid).pdf',
    category: 'invoices',
    fileName: 'Invoice_NUNC-INV-2026-001.pdf',
    fileSize: '340 KB',
    fileUrl: '#download-invoice',
    clientId: 'cli-apex',
    clientName: 'David Ramos',
    projectId: 'prj-1',
    uploadedBy: 'Finance & Accounts',
    uploadedAt: '2026-11-04T17:00:00Z',
    isPrivate: true
  }
];

// Initial Conversations & Messages
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    clientId: 'cli-apex',
    clientName: 'David Ramos (Apex Logistics)',
    clientEmail: 'david.ramos@apexlogistics.ph',
    channel: 'website_chat',
    status: 'active',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Carl Mendoza',
    lastMessageSnippet: 'The database schema diagram has been updated per our call.',
    lastMessageTime: '2026-11-08T14:15:00Z',
    unreadCount: 0,
    createdAt: '2026-11-02T10:00:00Z'
  },
  {
    id: 'conv-2',
    guestSessionId: 'guest-sess-982',
    clientName: 'Guest: Maria Santos',
    clientEmail: 'maria.santos@greenharvest.ph',
    channel: 'website_chat',
    status: 'pending',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Patricia Santos',
    lastMessageSnippet: 'Hello! Inquiring if your POS system can handle agricultural weight scales.',
    lastMessageTime: '2026-11-09T07:50:00Z',
    unreadCount: 1,
    createdAt: '2026-11-09T07:45:00Z'
  }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'cli-apex',
    senderName: 'David Ramos',
    senderRole: 'client',
    content: 'Good morning Carl! Could you verify if the warehouse module includes barcode generation for pallet labels?',
    timestamp: '2026-11-08T13:40:00Z',
    isRead: true
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'staff-2',
    senderName: 'Carl Mendoza',
    senderRole: 'staff',
    content: 'Good afternoon David! Yes, Code-128 and QR pallet labeling is included in Milestone 2. The database schema diagram has been updated per our call.',
    timestamp: '2026-11-08T14:15:00Z',
    isRead: true
  },
  {
    id: 'msg-3',
    conversationId: 'conv-2',
    senderId: 'guest-sess-982',
    senderName: 'Maria Santos',
    senderRole: 'guest',
    content: 'Hello! Inquiring if your POS system can handle agricultural weight scales via RS232/USB serial interfaces.',
    timestamp: '2026-11-09T07:50:00Z',
    isRead: false
  }
];

// Initial Legal Policies (All 7 required policies with draft notices)
const INITIAL_LEGAL_PAGES: LegalPage[] = [
  {
    id: 'legal-1',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    lastUpdated: 'November 2026',
    isDraft: true,
    content: `## Privacy Policy
**NUNC Business Solutions** (referred to as "NUNC", "we", "us", or "our") is dedicated to safeguarding your privacy in compliance with Republic Act No. 10173, also known as the Data Privacy Act of 2012 of the Philippines.

### 1. Information We Collect
We collect personal and corporate information when you interact with our website, request a consultation, submit a project inquiry, or access our Client Portal:
- Identity Information: Full name, business affiliation, and job designation.
- Contact Information: Business email address, contact numbers, and physical office address.
- Technical & Project Data: System requirements, budget parameters, and business process specifications.
- Account Information: User credentials, billing preferences, and transactional audit logs.

### 2. How We Use Collected Data
Your information is processed strictly for:
- Evaluating and responding to commercial inquiries and quotation requests.
- Provisioning and administering your Client Portal and project records.
- Sending essential transactional notices, invoices, and project milestone updates.
- Complying with regulatory obligations and resolving business disputes.

### 3. Data Protection & Sovereignty
All client records, uploaded documents, and private project specifications are stored within secure, access-controlled databases with Row Level Security (RLS). We never sell, rent, or trade your corporate information to external third parties.

*Notice: This document is an initial template provided for review and must be audited by qualified legal counsel prior to formal corporate enforcement.*`
  },
  {
    id: 'legal-2',
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    lastUpdated: 'November 2026',
    isDraft: true,
    content: `## Terms & Conditions
These Terms and Conditions govern access to and use of the website, client portals, and technological services offered by **NUNC Business Solutions**.

### 1. Acceptance of Terms
By accessing this website, submitting an inquiry, or accessing the Client Portal, you confirm that you have read, understood, and agreed to be bound by these Terms and our related corporate policies.

### 2. Services and Quotations
Descriptions of services on our public website are for general informational purposes. All custom software engineering, ERP deployments, and digital transformation services are governed by written Service Agreements and signed Quotations.

### 3. User Accounts and Credentials
Clients and staff granted access to authenticated portal areas are responsible for maintaining the confidentiality of their credentials and for all activities conducted under their account.

### 4. Intellectual Property
All website layouts, proprietary architectures, and digital materials remain the exclusive intellectual property of NUNC Business Solutions until explicitly transferred under a signed master contract.`
  },
  {
    id: 'legal-3',
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    lastUpdated: 'November 2026',
    isDraft: true,
    content: `## Cookie Policy
This Cookie Policy explains how **NUNC Business Solutions** uses cookies and similar browser storage technologies.

### 1. Essential Cookies
We use essential cookies and session storage strictly necessary to:
- Maintain your authenticated session in the Client Portal and Admin Dashboard.
- Preserve your live guest chat session while navigating our site.
- Record your user interface preferences.

### 2. Analytics Cookies
Where explicitly enabled, privacy-respecting analytics may measure aggregate website traffic to evaluate the performance of our service pages. No personally identifiable information is stored in analytics cookies.

### 3. Managing Cookie Preferences
You may manage or disable cookies via your browser configuration. Please note that disabling essential cookies will prevent authentication into the Client Portal.`
  },
  {
    id: 'legal-4',
    slug: 'refund-and-cancellation-policy',
    title: 'Refund & Cancellation Policy',
    lastUpdated: 'November 2026',
    isDraft: true,
    content: `## Refund & Cancellation Policy
### 1. Custom Software & Engineering Services
Because custom software engineering, ERP implementations, and business process automation require dedicated labor, technical architecture, and resource allocation:
- **Initial Down Payments**: The initial down payment (milestone 1) is non-refundable once architectural discovery, technical specifications, or database schema design has commenced.
- **Milestone Work**: Once a development milestone has been approved by the client or delivered in accordance with written specifications, payments allocated to that milestone are deemed earned and non-refundable.

### 2. Cancellation by Client
Should a client request project termination prior to completion, the client will remain liable for all labor, software licenses, and third-party infrastructure incurred up to the formal cancellation date.

### 3. Consultation Appointments
Appointments may be rescheduled or cancelled without penalty at least 24 hours prior to the scheduled meeting time.`
  },
  {
    id: 'legal-5',
    slug: 'payment-terms',
    title: 'Payment Terms',
    lastUpdated: 'November 2026',
    isDraft: true,
    content: `## Payment Terms
### 1. Invoicing and Payment Schedules
All software engineering and consulting engagements are billed in accordance with the milestone schedule specified in the formal Quotation or Service Agreement.

### 2. Standard Milestone Structure
Unless otherwise agreed in writing:
- **30% Initial Down Payment**: Required prior to project initiation and architectural design.
- **40% Mid-Development Milestone**: Due upon delivery of core functional modules for interim review.
- **30% Final Acceptance & Handover**: Due prior to final source code repository transfer and live domain deployment.

### 3. Multi-Currency Rules
Invoices are denominated in either Philippine Peso (PHP) or US Dollar (USD). Payments must be remitted in the exact currency indicated on the invoice.

### 4. Overdue Accounts
Invoices not settled within the designated due date may result in a temporary suspension of development milestones and portal deployment until accounts are brought to current standing.`
  },
  {
    id: 'legal-6',
    slug: 'service-agreement',
    title: 'Service Agreement',
    lastUpdated: 'November 2026',
    isDraft: true,
    content: `## Master Service Agreement (Template)
This Master Service Agreement outlines the core engagement framework between **NUNC Business Solutions** and the Client.

### 1. Scope of Work
NUNC agrees to perform the custom software engineering, web application development, or automation services specified in the approved Quotation and Statement of Work (SOW).

### 2. Client Responsibilities
The client shall provide timely access to necessary operational data, stakeholder reviews, and verification of delivered milestones. Delays in client feedback automatically extend project delivery timelines.

### 3. Warranty and Post-Deployment Support
All completed custom software deployments include a 90-day technical warranty against reproducible defects that deviate from the agreed specifications. Ongoing support agreements may be contracted separately.

### 4. Confidentiality
Both parties agree to treat all business data, proprietary source codes, financial arrangements, and client records with the highest standard of confidentiality.`
  },
  {
    id: 'legal-7',
    slug: 'data-protection-policy',
    title: 'Data Protection Policy',
    lastUpdated: 'November 2026',
    isDraft: true,
    content: `## Data Protection Policy
NUNC Business Solutions enforces organizational, physical, and technical safeguards to preserve the confidentiality, integrity, and availability of client information.

### 1. Technical Safeguards
- All web communication is encrypted using modern TLS 1.3 cryptographic protocols.
- Production databases utilize Row Level Security (RLS) ensuring strict cross-client data isolation.
- Sensitive credentials, API secrets, and encryption keys are strictly retained on secure server-side infrastructure and never exposed to browser runtimes.

### 2. Incident Response and Breach Notification
In the event of an identified security incident, NUNC maintains structured incident triage procedures to isolate affected systems, notify impacted parties, and coordinate with relevant authorities in compliance with Philippine data privacy guidelines.`
  }
];

// Initial Website CMS
const INITIAL_CMS: WebsiteCMS = {
  heroHeadline: 'Your Business Deserves Smarter Solutions.',
  heroSubtext: 'Empowering businesses through innovative software, intelligent automation, and customized digital solutions designed to simplify operations and accelerate growth.',
  ctaPrimaryText: 'Explore Our Services',
  ctaSecondaryText: 'Start a Project',
  companyName: 'NUNC Business Solutions',
  companyEmail: 'nuncbusinesssolutions@gmail.com',
  companyPhone: '09161669188',
  companyDomain: 'nuncbusinesssolutions.ph',
  mission: 'To empower businesses with reliable, innovative, and practical technology solutions that simplify operations and create opportunities for growth.',
  vision: 'To become a trusted business and technology solutions partner, helping organizations embrace digital transformation and build a smarter, more efficient future.',
  coreValues: [
    { title: 'Innovation', description: 'Crafting modern, intelligent software architectures that solve complex operational challenges.' },
    { title: 'Reliability', description: 'Building dependable, high-uptime digital systems engineered for long-term enterprise growth.' },
    { title: 'Integrity', description: 'Transparent project pricing, clear contractual deliverables, and respectful data stewardship.' },
    { title: 'Excellence', description: 'Uncompromising attention to architectural quality, visual discipline, and performance.' },
    { title: 'Customer Commitment', description: 'Partnering closely with business owners to understand real workflows before writing code.' },
    { title: 'Continuous Improvement', description: 'Iteratively refining processes, modernizing stacks, and keeping clients ahead of technology shifts.' }
  ],
  announcementText: 'Now accepting enterprise consultations for Q1 2027 custom management system implementations.',
  announcementActive: true
};

// Initial Integration Settings
const INITIAL_INTEGRATIONS: IntegrationSettings = {
  email: {
    provider: 'resend',
    apiKeyConfigured: Boolean(import.meta.env.RESEND_API_KEY),
    senderEmail: 'notifications@nuncbusinesssolutions.ph',
    destinationEmail: 'nuncbusinesssolutions@gmail.com',
    status: 'awaiting_configuration',
    verified: false
  },
  payment: {
    manualPaymentManagement: 'active', // Manual payment management enabled (Bank transfers, GCash, Maya)
    onlinePaymentProcessing: 'disabled', // Online payment processing disabled until gateway credentials configured
    gatewayProvider: 'PayMongo / Xendit (Awaiting Configuration)',
    publicKeyConfigured: Boolean(import.meta.env.PAYMENT_GATEWAY_PUBLIC_KEY),
    secretKeyConfigured: Boolean(import.meta.env.PAYMENT_GATEWAY_SECRET_KEY),
    webhookSecretConfigured: Boolean(import.meta.env.PAYMENT_GATEWAY_WEBHOOK_SECRET),
    supportsGcash: true,
    supportsMaya: true,
    supportsCards: true,
    status: 'awaiting_configuration',
    verified: false
  },
  messenger: {
    appIdConfigured: Boolean(import.meta.env.META_APP_ID),
    pageId: '',
    status: 'disabled', // Disabled until credentials configured
    connected: false
  },
  whatsapp: {
    phoneNumberId: '',
    tokenConfigured: Boolean(import.meta.env.WHATSAPP_ACCESS_TOKEN),
    status: 'disabled', // Disabled until credentials configured
    connected: false
  },
  websiteLiveChat: {
    provider: 'internal_hybrid',
    status: 'active' // Fully functional internal live chat
  },
  meetings: {
    googleMeetDefault: 'https://meet.google.com/nunc-discovery',
    zoomDefault: 'https://zoom.us/j/nuncsolutions',
    physicalOfficeAddress: 'NUNC Partner Meeting Suite, Bonifacio Global City, Taguig, Metro Manila, Philippines'
  }
};


interface AppDatabase {
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
  departments: Department[];
  staff: StaffMember[];
  inquiries: Inquiry[];
  clients: ClientRecord[];
  projects: Project[];
  tasks: ProjectTask[];
  appointments: Appointment[];
  quotations: Quotation[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  documents: DocumentItem[];
  conversations: Conversation[];
  messages: ChatMessage[];
  legalPages: LegalPage[];
  cms: WebsiteCMS;
  integrations: IntegrationSettings;
  notifications: SystemNotification[];
}

function loadDatabase(): AppDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        services: parsed.services || INITIAL_SERVICES,
        portfolio: parsed.portfolio || INITIAL_PORTFOLIO,
        faqs: parsed.faqs || INITIAL_FAQS,
        testimonials: parsed.testimonials || [],
        departments: parsed.departments || INITIAL_DEPARTMENTS,
        staff: parsed.staff || INITIAL_STAFF,
        inquiries: parsed.inquiries || INITIAL_INQUIRIES,
        clients: parsed.clients || INITIAL_CLIENTS,
        projects: parsed.projects || INITIAL_PROJECTS,
        tasks: parsed.tasks || INITIAL_TASKS,
        appointments: parsed.appointments || INITIAL_APPOINTMENTS,
        quotations: parsed.quotations || INITIAL_QUOTATIONS,
        invoices: parsed.invoices || INITIAL_INVOICES,
        payments: parsed.payments || INITIAL_PAYMENTS,
        documents: parsed.documents || INITIAL_DOCUMENTS,
        conversations: parsed.conversations || INITIAL_CONVERSATIONS,
        messages: parsed.messages || INITIAL_MESSAGES,
        legalPages: parsed.legalPages || INITIAL_LEGAL_PAGES,
        cms: parsed.cms || INITIAL_CMS,
        integrations: parsed.integrations || INITIAL_INTEGRATIONS,
        notifications: parsed.notifications || [
          {
            id: 'notif-1',
            type: 'inquiry',
            title: 'New Project Inquiry',
            message: 'Marcus Vance submitted an inquiry for Point of Sale Systems (Ref: NUNC-2026-INQ-003).',
            timestamp: '2026-11-08T08:45:00Z',
            isRead: false,
            linkTo: 'inquiries'
          },
          {
            id: 'notif-2',
            type: 'message',
            title: 'Live Chat Message',
            message: 'Maria Santos started a guest chat inquiring about hardware scales.',
            timestamp: '2026-11-09T07:50:00Z',
            isRead: false,
            linkTo: 'conversations'
          }
        ]
      };
    }
  } catch (err) {
    console.error('Failed to load database from localStorage, resetting to defaults', err);
  }

  const initial: AppDatabase = {
    services: INITIAL_SERVICES,
    portfolio: INITIAL_PORTFOLIO,
    faqs: INITIAL_FAQS,
    testimonials: [],
    departments: INITIAL_DEPARTMENTS,
    staff: INITIAL_STAFF,
    inquiries: INITIAL_INQUIRIES,
    clients: INITIAL_CLIENTS,
    projects: INITIAL_PROJECTS,
    tasks: INITIAL_TASKS,
    appointments: INITIAL_APPOINTMENTS,
    quotations: INITIAL_QUOTATIONS,
    invoices: INITIAL_INVOICES,
    payments: INITIAL_PAYMENTS,
    documents: INITIAL_DOCUMENTS,
    conversations: INITIAL_CONVERSATIONS,
    messages: INITIAL_MESSAGES,
    legalPages: INITIAL_LEGAL_PAGES,
    cms: INITIAL_CMS,
    integrations: INITIAL_INTEGRATIONS,
    notifications: [
      {
        id: 'notif-1',
        type: 'inquiry',
        title: 'New Project Inquiry',
        message: 'Marcus Vance submitted an inquiry for Point of Sale Systems (Ref: NUNC-2026-INQ-003).',
        timestamp: '2026-11-08T08:45:00Z',
        isRead: false,
        linkTo: 'inquiries'
      },
      {
        id: 'notif-2',
        type: 'message',
        title: 'Live Chat Message',
        message: 'Maria Santos started a guest chat inquiring about hardware scales.',
        timestamp: '2026-11-09T07:50:00Z',
        isRead: false,
        linkTo: 'conversations'
      }
    ]
  };

  saveDatabase(initial);
  return initial;
}

function saveDatabase(db: AppDatabase): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new Event('nunc_db_updated'));
  } catch (err) {
    console.error('Failed to save database to localStorage', err);
  }
}

let dbInstance: AppDatabase = loadDatabase();

async function dispatchServerNotification(payload: {
  type: string;
  subject: string;
  message: string;
  clientName?: string;
  clientEmail?: string;
  referenceNumber?: string;
}): Promise<void> {
  try {
    if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
      await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  } catch (err) {
    // Graceful handling for optional notification endpoints - never crash the application
    console.debug('[Notification Dispatch Logged]:', payload.subject);
  }
}

export const db = {
  getSnapshot: (): AppDatabase => {
    dbInstance = loadDatabase();
    return dbInstance;
  },

  // Inquiries
  createInquiry: (data: Omit<Inquiry, 'id' | 'referenceNumber' | 'status' | 'createdAt' | 'updatedAt'>): Inquiry => {
    const current = loadDatabase();
    const count = current.inquiries.length + 1;
    const ref = `NUNC-${new Date().getFullYear()}-INQ-${String(count).padStart(3, '0')}`;
    const newInquiry: Inquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      referenceNumber: ref,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    current.inquiries.unshift(newInquiry);

    // Also push a system notification
    current.notifications.unshift({
      id: `notif-${Date.now()}`,
      type: 'inquiry',
      title: 'New Inquiry Submitted',
      message: `${newInquiry.fullName} (${newInquiry.businessName}) submitted ${newInquiry.serviceName}.`,
      timestamp: newInquiry.createdAt,
      isRead: false,
      linkTo: 'inquiries'
    });

    saveDatabase(current);

    // Dispatch transactional server email notification to NOTIFICATION_EMAIL
    dispatchServerNotification({
      type: 'Inquiry',
      subject: `New Project Inquiry: ${newInquiry.referenceNumber} - ${newInquiry.businessName}`,
      message: `${newInquiry.fullName} from ${newInquiry.businessName} submitted an inquiry for ${newInquiry.serviceName} with budget parameter ${newInquiry.budgetRange}. Requirements: ${newInquiry.requirements}`,
      clientName: newInquiry.fullName,
      clientEmail: newInquiry.email,
      referenceNumber: newInquiry.referenceNumber
    });

    return newInquiry;
  },

  updateInquiryStatus: (id: string, status: Inquiry['status'], notes?: string): Inquiry | null => {
    const current = loadDatabase();
    const item = current.inquiries.find(i => i.id === id);
    if (!item) return null;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    if (notes) item.statusNotes = notes;
    saveDatabase(current);
    return item;
  },

  assignInquiry: (inquiryId: string, staffId: string): Inquiry | null => {
    const current = loadDatabase();
    const item = current.inquiries.find(i => i.id === inquiryId);
    const staff = current.staff.find(s => s.id === staffId);
    if (!item || !staff) return null;
    item.assignedStaffId = staff.id;
    item.assignedStaffName = staff.fullName;
    item.updatedAt = new Date().toISOString();
    staff.assignedInquiriesCount += 1;
    saveDatabase(current);
    return item;
  },

  // Appointments (with anti-double-booking validation)
  bookAppointment: (data: Omit<Appointment, 'id' | 'referenceNumber' | 'status' | 'createdAt'>): { success: boolean; appointment?: Appointment; error?: string } => {
    const current = loadDatabase();
    // Double booking check: same date and time slot
    const conflict = current.appointments.find(
      a => a.date === data.date && a.timeSlot === data.timeSlot && a.status !== 'cancelled'
    );
    if (conflict) {
      return {
        success: false,
        error: `The slot ${data.timeSlot} on ${data.date} is already reserved. Please select another time or date.`
      };
    }

    const count = current.appointments.length + 1;
    const ref = `NUNC-APT-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      referenceNumber: ref,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    current.appointments.unshift(newApt);

    current.notifications.unshift({
      id: `notif-${Date.now()}`,
      type: 'appointment',
      title: 'New Consultation Requested',
      message: `${newApt.clientName} booked ${newApt.type} consultation for ${newApt.date} at ${newApt.timeSlot}.`,
      timestamp: newApt.createdAt,
      isRead: false,
      linkTo: 'appointments'
    });

    saveDatabase(current);

    // Dispatch transactional server email notification to NOTIFICATION_EMAIL
    dispatchServerNotification({
      type: 'Appointment',
      subject: `New Consultation Booked: ${newApt.referenceNumber} - ${newApt.clientName}`,
      message: `${newApt.clientName} booked a ${newApt.type} consultation for ${newApt.date} at ${newApt.timeSlot} (${newApt.timeZone}). Service: ${newApt.serviceInterestedIn}. Requirements: ${newApt.requirements}`,
      clientName: newApt.clientName,
      clientEmail: newApt.clientEmail,
      referenceNumber: newApt.referenceNumber
    });

    return { success: true, appointment: newApt };
  },

  updateAppointmentStatus: (id: string, status: Appointment['status'], updates?: Partial<Appointment>): Appointment | null => {
    const current = loadDatabase();
    const apt = current.appointments.find(a => a.id === id);
    if (!apt) return null;
    apt.status = status;
    if (updates) Object.assign(apt, updates);
    saveDatabase(current);
    return apt;
  },

  // Projects & Tasks
  createProject: (data: Omit<Project, 'id' | 'projectCode' | 'createdAt' | 'updatedAt'>): Project => {
    const current = loadDatabase();
    const count = current.projects.length + 1;
    const code = `NUNC-PRJ-${new Date().getFullYear()}-${String(count).padStart(2, '0')}`;
    const newPrj: Project = {
      ...data,
      id: `prj-${Date.now()}`,
      projectCode: code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    current.projects.unshift(newPrj);
    saveDatabase(current);
    return newPrj;
  },

  updateProject: (id: string, updates: Partial<Project>): Project | null => {
    const current = loadDatabase();
    const prj = current.projects.find(p => p.id === id);
    if (!prj) return null;
    Object.assign(prj, updates, { updatedAt: new Date().toISOString() });
    saveDatabase(current);
    return prj;
  },

  createTask: (data: Omit<ProjectTask, 'id' | 'createdAt'>): ProjectTask => {
    const current = loadDatabase();
    const newTask: ProjectTask = {
      ...data,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    current.tasks.unshift(newTask);
    saveDatabase(current);
    return newTask;
  },

  updateTaskStatus: (taskId: string, status: ProjectTask['status']): ProjectTask | null => {
    const current = loadDatabase();
    const task = current.tasks.find(t => t.id === taskId);
    if (!task) return null;
    task.status = status;
    saveDatabase(current);
    return task;
  },

  addTaskComment: (taskId: string, author: string, text: string): ProjectTask | null => {
    const current = loadDatabase();
    const task = current.tasks.find(t => t.id === taskId);
    if (!task) return null;
    task.internalComments.push({
      id: `comm-${Date.now()}`,
      author,
      text,
      date: new Date().toISOString()
    });
    saveDatabase(current);
    return task;
  },

  // Quotations & Invoices
  createQuotation: (data: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt'>): Quotation => {
    const current = loadDatabase();
    const count = current.quotations.length + 1;
    const num = `NUNC-QT-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    const newQt: Quotation = {
      ...data,
      id: `qt-${Date.now()}`,
      quotationNumber: num,
      createdAt: new Date().toISOString()
    };
    current.quotations.unshift(newQt);
    saveDatabase(current);
    return newQt;
  },

  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>): Invoice => {
    const current = loadDatabase();
    const count = current.invoices.length + 1;
    const num = `NUNC-INV-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    const newInv: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber: num,
      createdAt: new Date().toISOString()
    };
    current.invoices.unshift(newInv);

    // Also link to client's total billed
    const client = current.clients.find(c => c.id === data.clientId);
    if (client) {
      if (data.currency === 'PHP') client.totalBilledPhp += data.total;
      else client.totalBilledUsd += data.total;
    }

    saveDatabase(current);
    return newInv;
  },

  updateInvoiceStatus: (id: string, status: Invoice['status']): Invoice | null => {
    const current = loadDatabase();
    const inv = current.invoices.find(i => i.id === id);
    if (!inv) return null;
    inv.status = status;
    saveDatabase(current);
    return inv;
  },

  // Payments
  recordPayment: (data: Omit<PaymentRecord, 'id' | 'paymentReference' | 'verificationStatus' | 'createdAt'>): PaymentRecord => {
    const current = loadDatabase();
    const count = current.payments.length + 1;
    const ref = `NUNC-PAY-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    const newPay: PaymentRecord = {
      ...data,
      id: `pay-${Date.now()}`,
      paymentReference: ref,
      verificationStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    current.payments.unshift(newPay);

    current.notifications.unshift({
      id: `notif-${Date.now()}`,
      type: 'payment',
      title: 'Payment Proof Submitted',
      message: `${newPay.clientName} recorded ${newPay.currency} ${newPay.amount.toLocaleString()} via ${newPay.method.toUpperCase()} for verification.`,
      timestamp: newPay.createdAt,
      isRead: false,
      linkTo: 'payments'
    });

    saveDatabase(current);

    // Dispatch transactional server email notification to NOTIFICATION_EMAIL
    dispatchServerNotification({
      type: 'Payment Proof',
      subject: `Payment Proof Submitted: ${newPay.paymentReference} (${newPay.currency} ${newPay.amount.toLocaleString()})`,
      message: `${newPay.clientName} recorded a payment of ${newPay.currency} ${newPay.amount.toLocaleString()} via ${newPay.method.toUpperCase()} (Txn Ref: ${newPay.transactionReference}). Awaiting staff verification in Admin Console.`,
      clientName: newPay.clientName,
      referenceNumber: newPay.paymentReference
    });

    return newPay;
  },

  verifyPayment: (id: string, staffId: string, status: 'verified' | 'rejected'): PaymentRecord | null => {
    const current = loadDatabase();
    const pay = current.payments.find(p => p.id === id);
    if (!pay) return null;
    pay.verificationStatus = status;
    pay.verifiedByStaffId = staffId;
    pay.verifiedAt = new Date().toISOString();

    if (status === 'verified' && pay.invoiceId) {
      const inv = current.invoices.find(i => i.id === pay.invoiceId);
      if (inv) {
        inv.amountPaid += pay.amount;
        inv.balanceDue = Math.max(0, inv.total - inv.amountPaid);
        if (inv.balanceDue === 0) inv.status = 'paid';
        else inv.status = 'partially_paid';
      }
      const client = current.clients.find(c => c.id === pay.clientId);
      if (client) {
        if (pay.currency === 'PHP') client.totalPaidPhp += pay.amount;
        else client.totalPaidUsd += pay.amount;
      }
    }

    saveDatabase(current);
    return pay;
  },

  // Messaging & Omnichannel Chat
  sendMessage: (conversationId: string, senderId: string, senderName: string, senderRole: ChatMessage['senderRole'], content: string, attachments?: ChatMessage['attachments']): ChatMessage => {
    const current = loadDatabase();
    let conv = current.conversations.find(c => c.id === conversationId);
    const now = new Date().toISOString();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      senderRole,
      content,
      attachments,
      timestamp: now,
      isRead: senderRole === 'super_admin' || senderRole === 'staff'
    };
    current.messages.push(newMsg);

    if (conv) {
      conv.lastMessageSnippet = content.substring(0, 80);
      conv.lastMessageTime = now;
      if (senderRole === 'client' || senderRole === 'guest') {
        conv.unreadCount += 1;
      }
    }

    saveDatabase(current);
    return newMsg;
  },

  getOrCreateGuestConversation: (guestName: string, guestEmail: string): Conversation => {
    const current = loadDatabase();
    let conv = current.conversations.find(c => c.clientEmail.toLowerCase() === guestEmail.toLowerCase());
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        guestSessionId: `guest-${Date.now()}`,
        clientName: `Guest: ${guestName}`,
        clientEmail: guestEmail,
        channel: 'website_chat',
        status: 'pending',
        lastMessageSnippet: 'Conversation started',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        createdAt: new Date().toISOString()
      };
      current.conversations.unshift(conv);
      saveDatabase(current);
    }
    return conv;
  },

  // Documents
  uploadDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>): DocumentItem => {
    const current = loadDatabase();
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    current.documents.unshift(newDoc);
    saveDatabase(current);
    return newDoc;
  },

  // CMS Updates
  updateCMS: (updates: Partial<WebsiteCMS>): WebsiteCMS => {
    const current = loadDatabase();
    current.cms = { ...current.cms, ...updates };
    saveDatabase(current);
    return current.cms;
  },

  updateLegalPage: (id: string, content: string, isDraft: boolean): LegalPage | null => {
    const current = loadDatabase();
    const page = current.legalPages.find(p => p.id === id);
    if (!page) return null;
    page.content = content;
    page.isDraft = isDraft;
    page.lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    saveDatabase(current);
    return page;
  },

  updateService: (id: string, updates: Partial<ServiceItem>): ServiceItem | null => {
    const current = loadDatabase();
    const srv = current.services.find(s => s.id === id);
    if (!srv) return null;
    Object.assign(srv, updates);
    saveDatabase(current);
    return srv;
  },

  addService: (srv: Omit<ServiceItem, 'id'>): ServiceItem => {
    const current = loadDatabase();
    const newSrv: ServiceItem = {
      ...srv,
      id: `srv-${Date.now()}`
    };
    current.services.push(newSrv);
    saveDatabase(current);
    return newSrv;
  },

  deleteService: (id: string): boolean => {
    const current = loadDatabase();
    const idx = current.services.findIndex(s => s.id === id);
    if (idx === -1) return false;
    current.services.splice(idx, 1);
    saveDatabase(current);
    return true;
  },

  // Portfolio CMS
  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>): PortfolioItem => {
    const current = loadDatabase();
    const newItem: PortfolioItem = {
      ...item,
      id: `port-${Date.now()}`
    };
    current.portfolio.unshift(newItem);
    saveDatabase(current);
    return newItem;
  },

  updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>): PortfolioItem | null => {
    const current = loadDatabase();
    const item = current.portfolio.find(p => p.id === id);
    if (!item) return null;
    Object.assign(item, updates);
    saveDatabase(current);
    return item;
  },

  deletePortfolioItem: (id: string): boolean => {
    const current = loadDatabase();
    const idx = current.portfolio.findIndex(p => p.id === id);
    if (idx === -1) return false;
    current.portfolio.splice(idx, 1);
    saveDatabase(current);
    return true;
  },

  // FAQs CMS
  addFAQ: (faq: Omit<FAQItem, 'id'>): FAQItem => {
    const current = loadDatabase();
    const newFaq: FAQItem = {
      ...faq,
      id: `faq-${Date.now()}`
    };
    current.faqs.push(newFaq);
    saveDatabase(current);
    return newFaq;
  },

  updateFAQ: (id: string, updates: Partial<FAQItem>): FAQItem | null => {
    const current = loadDatabase();
    const item = current.faqs.find(f => f.id === id);
    if (!item) return null;
    Object.assign(item, updates);
    saveDatabase(current);
    return item;
  },

  deleteFAQ: (id: string): boolean => {
    const current = loadDatabase();
    const idx = current.faqs.findIndex(f => f.id === id);
    if (idx === -1) return false;
    current.faqs.splice(idx, 1);
    saveDatabase(current);
    return true;
  },

  // Testimonials CMS (Unpublished by default per requirement §27)
  addTestimonial: (item: Omit<TestimonialItem, 'id' | 'createdAt'>): TestimonialItem => {
    const current = loadDatabase();
    const newItem: TestimonialItem = {
      ...item,
      id: `testi-${Date.now()}`,
      isPublished: false, // strictly enforce unpublished initially
      createdAt: new Date().toISOString()
    };
    current.testimonials.unshift(newItem);
    saveDatabase(current);
    return newItem;
  },

  updateTestimonial: (id: string, updates: Partial<TestimonialItem>): TestimonialItem | null => {
    const current = loadDatabase();
    const item = current.testimonials.find(t => t.id === id);
    if (!item) return null;
    Object.assign(item, updates);
    saveDatabase(current);
    return item;
  },

  // Staff and Departments
  addStaff: (member: Omit<StaffMember, 'id' | 'assignedInquiriesCount' | 'activeProjectsCount' | 'completedTasksCount' | 'pendingTasksCount'>): StaffMember => {
    const current = loadDatabase();
    const newStaff: StaffMember = {
      ...member,
      id: `staff-${Date.now()}`,
      assignedInquiriesCount: 0,
      activeProjectsCount: 0,
      completedTasksCount: 0,
      pendingTasksCount: 0
    };
    current.staff.push(newStaff);
    saveDatabase(current);
    return newStaff;
  },

  updateStaff: (id: string, updates: Partial<StaffMember>): StaffMember | null => {
    const current = loadDatabase();
    const staff = current.staff.find(s => s.id === id);
    if (!staff) return null;
    Object.assign(staff, updates);
    saveDatabase(current);
    return staff;
  },

  addDepartment: (dept: Omit<Department, 'id' | 'staffCount'>): Department => {
    const current = loadDatabase();
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`,
      staffCount: 0
    };
    current.departments.push(newDept);
    saveDatabase(current);
    return newDept;
  },

  // Integrations settings
  updateIntegrations: (updates: Partial<IntegrationSettings>): IntegrationSettings => {
    const current = loadDatabase();
    current.integrations = { ...current.integrations, ...updates };
    saveDatabase(current);
    return current.integrations;
  },

  // Backup & Restore
  exportBackupJson: (): string => {
    const current = loadDatabase();
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      company: 'NUNC Business Solutions',
      data: current
    }, null, 2);
  },

  importBackupJson: (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.data && parsed.company === 'NUNC Business Solutions') {
        saveDatabase(parsed.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  resetToDefault: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    dbInstance = loadDatabase();
  }
};
