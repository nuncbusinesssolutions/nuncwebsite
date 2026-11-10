export type UserRole = 'super_admin' | 'staff' | 'client';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  businessName?: string;
  phone?: string;
  role: UserRole;
  departmentId?: string;
  positionId?: string;
  avatarUrl?: string;
  createdAt: string;
  status: 'active' | 'suspended';
}

export interface Department {
  id: string;
  name: string;
  description: string;
  headStaffId?: string;
  staffCount: number;
}

export interface StaffPosition {
  id: string;
  departmentId: string;
  title: string;
  responsibilities: string;
}

export interface StaffMember {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  position: string;
  role: 'super_admin' | 'staff';
  status: 'active' | 'inactive';
  assignedInquiriesCount: number;
  activeProjectsCount: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  performanceNotes?: string;
}

export type InquiryStatus =
  | 'new'
  | 'under_review'
  | 'awaiting_client'
  | 'approved'
  | 'rejected'
  | 'converted'
  | 'closed';

export interface Inquiry {
  id: string;
  referenceNumber: string; // e.g. NUNC-2026-INQ-001
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  budgetRange: string;
  requirements: string;
  preferredContact: 'email' | 'phone' | 'whatsapp' | 'meeting';
  status: InquiryStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  clientId?: string;
  createdAt: string;
  updatedAt: string;
  statusNotes?: string;
}

export interface ClientRecord {
  id: string;
  userId?: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  address?: string;
  totalBilledPhp: number;
  totalPaidPhp: number;
  totalBilledUsd: number;
  totalPaidUsd: number;
  activeProjectsCount: number;
  createdAt: string;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed';

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  percentageWeight: number; // e.g. 30
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  amount?: number;
  currency?: 'PHP' | 'USD';
  isPaid?: boolean;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'under_review' | 'completed' | 'on_hold';
  dueDate: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  dependencies?: string[]; // IDs of tasks that must be done first
  internalComments: { id: string; author: string; text: string; date: string }[];
  createdAt: string;
}

export interface Project {
  id: string;
  projectCode: string; // e.g. NUNC-PRJ-2026-01
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientBusiness: string;
  managerStaffId?: string;
  managerStaffName?: string;
  serviceCategory: string;
  status: ProjectStatus;
  progressPercentage: number;
  budgetTotal: number;
  currency: 'PHP' | 'USD';
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  detailedTrackingEnabled: boolean; // super admin toggle
  milestones: ProjectMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  referenceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  businessName?: string;
  serviceInterestedIn: string;
  type: 'online' | 'in_person';
  meetingPlatform?: 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'Custom';
  meetingLink?: string;
  locationAddress?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. 10:00 AM - 11:00 AM
  timeZone: string; // default Asia/Manila (GMT+8)
  requirements: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled';
  assignedStaffId?: string;
  assignedStaffName?: string;
  adminNotes?: string;
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage or fixed
  amount: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. NUNC-QT-2026-001
  clientId: string;
  clientName: string;
  clientBusiness: string;
  clientEmail: string;
  projectTitle: string;
  currency: 'PHP' | 'USD';
  items: LineItem[];
  subtotal: number;
  taxRate: number; // e.g. 12% VAT
  taxAmount: number;
  discountTotal: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  paymentTerms: string;
  notes: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. NUNC-INV-2026-001
  clientId: string;
  clientName: string;
  clientBusiness: string;
  clientEmail: string;
  projectId?: string;
  projectTitle?: string;
  currency: 'PHP' | 'USD';
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountTotal: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paymentInstructions: string;
  isManualUpload?: boolean;
  manualPdfUrl?: string;
  notes: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  paymentReference: string;
  invoiceId?: string;
  invoiceNumber?: string;
  projectId?: string;
  projectTitle?: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: 'PHP' | 'USD';
  paymentDate: string;
  method: 'bank_transfer' | 'gcash' | 'maya' | 'card' | 'cash';
  transactionReference: string;
  proofUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedByStaffId?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'proposals' | 'quotations' | 'contracts' | 'invoices' | 'receipts' | 'deliverables' | 'other';
  fileName: string;
  fileSize: string;
  fileUrl: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  uploadedBy: string;
  uploadedAt: string;
  isPrivate: boolean;
}

export interface MessageAttachment {
  name: string;
  size: string;
  url: string;
  type: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'super_admin' | 'staff' | 'client' | 'guest';
  content: string;
  attachments?: MessageAttachment[];
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  guestSessionId?: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  channel: 'website_chat' | 'email' | 'messenger' | 'whatsapp';
  status: 'active' | 'archived' | 'pending';
  assignedStaffId?: string;
  assignedStaffName?: string;
  lastMessageSnippet: string;
  lastMessageTime: string;
  unreadCount: number;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  detailedInfo: string;
  benefits: string[];
  features: string[];
  imageUrl: string;
  displayOrder: number;
  isPublished: boolean;
  serviceFaqs: { question: string; answer: string }[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  demoLabel: 'DEMO PROJECT' | 'CONCEPT PROJECT';
  tags: string[];
  isPublished: boolean;
  displayOrder: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General Information' | 'Services' | 'Project Development' | 'Payments' | 'Quotations' | 'Consultations' | 'Client Support';
  displayOrder: number;
  isPublished: boolean;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  quote: string;
  rating: number;
  isPublished: boolean; // initially false per requirement
  createdAt: string;
}

export interface LegalPage {
  id: string;
  slug: string;
  title: string;
  lastUpdated: string;
  isDraft: boolean;
  content: string;
}

export interface WebsiteCMS {
  heroHeadline: string;
  heroSubtext: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyDomain: string;
  mission: string;
  vision: string;
  coreValues: { title: string; description: string }[];
  announcementText?: string;
  announcementActive: boolean;
}

export interface IntegrationSettings {
  email: {
    provider: 'resend';
    apiKeyConfigured: boolean;
    senderEmail: string;
    destinationEmail: string;
    status: 'active' | 'awaiting_configuration';
    verified: boolean;
  };
  payment: {
    manualPaymentManagement: 'active';
    onlinePaymentProcessing: 'disabled';
    gatewayProvider: string;
    publicKeyConfigured: boolean;
    secretKeyConfigured: boolean;
    webhookSecretConfigured: boolean;
    supportsGcash: boolean;
    supportsMaya: boolean;
    supportsCards: boolean;
    status: 'awaiting_configuration' | 'configured_but_pending_activation';
    verified: boolean;
  };
  messenger: {
    appIdConfigured: boolean;
    pageId: string;
    status: 'disabled';
    connected: boolean;
  };
  whatsapp: {
    phoneNumberId: string;
    tokenConfigured: boolean;
    status: 'disabled';
    connected: boolean;
  };
  websiteLiveChat: {
    provider: 'internal_hybrid';
    status: 'active';
  };
  meetings: {
    googleMeetDefault: string;
    zoomDefault: string;
    physicalOfficeAddress: string;
  };
}

export interface SystemNotification {
  id: string;
  type: 'inquiry' | 'message' | 'appointment' | 'payment' | 'project';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkTo?: string;
}
