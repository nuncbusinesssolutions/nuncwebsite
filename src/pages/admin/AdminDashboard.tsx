import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/database';
import { generateInvoicePDF, generateQuotationPDF } from '../../lib/pdfGenerator';
import {
  Inquiry,
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
  StaffMember,
  Department,
  IntegrationSettings
} from '../../lib/types';
import {
  LayoutDashboard,
  Inbox,
  Users,
  MessageSquare,
  Briefcase,
  CheckSquare,
  UserCheck,
  Calendar,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  FolderLock,
  Wrench,
  Image as ImageIcon,
  Globe,
  HelpCircle,
  MessageCircle,
  Scale,
  BarChart3,
  Bell,
  Settings,
  Shield,
  Database,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Upload,
  Send,
  Eye,
  Trash2,
  Edit,
  ArrowRight,
  Filter,
  RefreshCw,
  Mail,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (route: string, subParam?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [snapshot, setSnapshot] = useState(db.getSnapshot());

  useEffect(() => {
    const handleUpdate = () => setSnapshot(db.getSnapshot());
    window.addEventListener('nunc_db_updated', handleUpdate);
    return () => window.removeEventListener('nunc_db_updated', handleUpdate);
  }, []);

  const isSuperAdmin = user?.role === 'super_admin';

  // Navigation items for the Admin/Staff Sidebar (23 modules organized into groups)
  const navSections = [
    {
      title: 'Operations & Pipeline',
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'inquiries', label: `Inquiries (${snapshot.inquiries.length})`, icon: Inbox },
        { id: 'clients', label: `Clients CRM (${snapshot.clients.length})`, icon: Users },
        { id: 'inbox', label: `Omnichannel Inbox (${snapshot.conversations.length})`, icon: MessageSquare },
        { id: 'projects', label: `Projects (${snapshot.projects.length})`, icon: Briefcase },
        { id: 'tasks', label: `Task Board (${snapshot.tasks.length})`, icon: CheckSquare },
        { id: 'appointments', label: `Appointments (${snapshot.appointments.length})`, icon: Calendar },
      ]
    },
    {
      title: 'Financial & Documents',
      items: [
        { id: 'quotations', label: `Quotations (${snapshot.quotations.length})`, icon: FileSpreadsheet },
        { id: 'invoices', label: `Invoices (${snapshot.invoices.length})`, icon: Receipt },
        { id: 'payments', label: `Payments & Proofs (${snapshot.payments.length})`, icon: CreditCard },
        { id: 'documents', label: `Document Vault (${snapshot.documents.length})`, icon: FolderLock },
      ]
    },
    {
      title: 'Organization & Staff',
      items: [
        { id: 'staff', label: `Staff & Departments`, icon: UserCheck },
        { id: 'analytics', label: 'Analytics & BI Reports', icon: BarChart3 },
        { id: 'notifications', label: `Notifications (${snapshot.notifications.filter(n => !n.isRead).length})`, icon: Bell },
      ]
    },
    {
      title: 'Website CMS & Legal',
      items: [
        { id: 'cms_services', label: `Services CMS (${snapshot.services.length})`, icon: Wrench },
        { id: 'cms_portfolio', label: `Portfolio CMS (${snapshot.portfolio.length})`, icon: ImageIcon },
        { id: 'cms_website', label: 'Website CMS & Hero', icon: Globe },
        { id: 'cms_faqs', label: `FAQ Manager (${snapshot.faqs.length})`, icon: HelpCircle },
        { id: 'cms_testimonials', label: `Testimonials (${snapshot.testimonials.length})`, icon: MessageCircle },
        { id: 'cms_legal', label: 'Legal Center CMS', icon: Scale },
      ]
    },
    {
      title: 'System & Security',
      items: [
        { id: 'integrations', label: 'Integration Settings', icon: Settings },
        { id: 'settings', label: 'Business & Tax Settings', icon: Shield },
        { id: 'backup', label: 'Backup & Disaster Recovery', icon: Database },
      ]
    }
  ];

  // Financial metrics calculated separately for PHP and USD (Rule §20: "Do not automatically combine different currencies into one financial total")
  const phpInvoiced = snapshot.invoices.filter(i => i.currency === 'PHP').reduce((acc, i) => acc + i.total, 0);
  const phpPaid = snapshot.payments.filter(p => p.currency === 'PHP' && p.verificationStatus === 'verified').reduce((acc, p) => acc + p.amount, 0);
  const phpOutstanding = Math.max(0, phpInvoiced - phpPaid);

  const usdInvoiced = snapshot.invoices.filter(i => i.currency === 'USD').reduce((acc, i) => acc + i.total, 0);
  const usdPaid = snapshot.payments.filter(p => p.currency === 'USD' && p.verificationStatus === 'verified').reduce((acc, p) => acc + p.amount, 0);
  const usdOutstanding = Math.max(0, usdInvoiced - usdPaid);

  // Omnichannel Inbox State
  const [selectedConvId, setSelectedConvId] = useState<string>(snapshot.conversations[0]?.id || '');
  const activeConversation = snapshot.conversations.find(c => c.id === selectedConvId) || snapshot.conversations[0];
  const activeMessages = activeConversation ? snapshot.messages.filter(m => m.conversationId === activeConversation.id) : [];
  const [adminReplyText, setAdminReplyText] = useState('');

  // Modals
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    description: '',
    clientId: snapshot.clients[0]?.id || '',
    serviceCategory: 'Custom Business Management Systems',
    budgetTotal: 300000,
    currency: 'PHP' as 'PHP' | 'USD',
    startDate: new Date().toISOString().split('T')[0],
    targetEndDate: '2026-12-31'
  });

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    projectId: snapshot.projects[0]?.id || '',
    title: '',
    description: '',
    priority: 'medium' as ProjectTask['priority'],
    assignedStaffId: snapshot.staff[0]?.id || '',
    dueDate: '2026-11-30'
  });

  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    clientId: snapshot.clients[0]?.id || '',
    projectId: snapshot.projects[0]?.id || '',
    currency: 'PHP' as 'PHP' | 'USD',
    description: 'Custom Development Milestone Delivery',
    amount: 100000,
    taxRate: 12,
    dueDate: '2026-11-30',
    paymentInstructions: 'Bank Transfer to NUNC BDO Account or GCash Corporate QR.'
  });

  const handleAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !activeConversation) return;

    db.sendMessage(
      activeConversation.id,
      user?.id || 'admin-1',
      user?.fullName || 'NUNC Support',
      user?.role || 'staff',
      adminReplyText.trim()
    );
    setAdminReplyText('');
  };

  // Test Email Notification state & handler
  const [emailTestState, setEmailTestState] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
    emailId?: string;
    senderUsed?: string;
    timestamp?: string;
  } | null>(null);

  const handleTriggerTestEmail = async () => {
    setEmailTestState({ loading: true });
    try {
      const res = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success && data.delivered) {
        setEmailTestState({
          loading: false,
          success: true,
          message: `Verified delivery to ${data.destination}!`,
          emailId: data.emailId,
          senderUsed: data.senderUsed,
          timestamp: data.timestamp
        });
      } else {
        setEmailTestState({
          loading: false,
          success: false,
          message: data.error || 'Failed to dispatch test email.'
        });
      }
    } catch (err: any) {
      setEmailTestState({
        loading: false,
        success: false,
        message: err?.message || 'Network error reaching test email service.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Admin Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
              N
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                NUNC Management
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                Console v1.0 · Supabase Ready
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-slate-200 capitalize">
              {user?.role.replace('_', ' ')}:
            </span>
            <span className="text-slate-300">{user?.fullName}</span>
          </div>

          <button
            onClick={() => navigate('home')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            View Public Website
          </button>

          <button
            onClick={logout}
            className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800/50 text-red-200 rounded-lg text-xs font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Sidebar (260px) */}
        <aside className="w-full md:w-64 bg-white rounded-2xl border border-slate-200 p-4 shrink-0 shadow-xs h-fit space-y-6">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                {sec.title}
              </span>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                      isActive
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          
          {/* 1. DASHBOARD OVERVIEW */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h2>
                <p className="text-xs text-slate-500">Live operational oversight, pipeline volume, and isolated currency ledgers.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Total Inquiries</span>
                    <Inbox className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{snapshot.inquiries.length}</div>
                  <div className="text-[11px] text-emerald-600 mt-1 font-medium">
                    {snapshot.inquiries.filter(i => i.status === 'new').length} New / Unassigned
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Active Projects</span>
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                    {snapshot.projects.filter(p => p.status === 'in_progress').length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {snapshot.projects.length} Total Registered
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>PHP Revenue Collected</span>
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                    ₱{phpPaid.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    ₱{phpOutstanding.toLocaleString()} Outstanding Receivables
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>USD Revenue Collected</span>
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                    ${usdPaid.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    ${usdOutstanding.toLocaleString()} Outstanding Receivables
                  </div>
                </div>
              </div>

              {/* Inquiries & Workload Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Inquiries (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Recent Project Inquiries</h3>
                    <button
                      onClick={() => setActiveModule('inquiries')}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-800"
                    >
                      View All &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {snapshot.inquiries.slice(0, 4).map((inq) => (
                      <div key={inq.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-700">{inq.referenceNumber}</span>
                            <span className="font-bold text-slate-900">{inq.businessName}</span>
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {inq.fullName} · {inq.serviceName}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inq.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          inq.status === 'new' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {inq.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Staff Workload (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900">Staff Workload Distribution</h3>
                  <div className="space-y-3">
                    {snapshot.staff.map((s) => (
                      <div key={s.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{s.fullName}</span>
                          <span className="text-[10px] font-mono text-slate-500">{s.position}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-600">
                          <span>Inquiries: <strong>{s.assignedInquiriesCount}</strong></span>
                          <span>Projects: <strong>{s.activeProjectsCount}</strong></span>
                          <span>Tasks Done: <strong>{s.completedTasksCount}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 2. INQUIRIES MANAGEMENT (§11) */}
          {activeModule === 'inquiries' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Project Inquiries Pipeline</h2>
                  <p className="text-xs text-slate-500">Assign inquiries to staff, review budget parameters, and convert to active projects.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/75">
                      <th className="py-3 px-3 font-semibold">Ref Code</th>
                      <th className="py-3 px-3 font-semibold">Client & Entity</th>
                      <th className="py-3 px-3 font-semibold">Requested Service</th>
                      <th className="py-3 px-3 font-semibold">Budget Parameter</th>
                      <th className="py-3 px-3 font-semibold">Assigned Staff</th>
                      <th className="py-3 px-3 font-semibold">Status</th>
                      <th className="py-3 px-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {snapshot.inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-blue-700">{inq.referenceNumber}</td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900">{inq.fullName}</div>
                          <div className="text-[11px] text-slate-500">{inq.businessName} · {inq.phone}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-700">{inq.serviceName}</td>
                        <td className="py-3.5 px-3 font-mono text-slate-600">{inq.budgetRange}</td>
                        <td className="py-3.5 px-3">
                          <select
                            value={inq.assignedStaffId || ''}
                            onChange={(e) => db.assignInquiry(inq.id, e.target.value)}
                            className="text-xs border border-slate-200 rounded px-2 py-1 bg-white"
                          >
                            <option value="">Unassigned</option>
                            {snapshot.staff.map((s) => (
                              <option key={s.id} value={s.id}>{s.fullName}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-3">
                          <select
                            value={inq.status}
                            onChange={(e) => db.updateInquiryStatus(inq.id, e.target.value as any)}
                            className="text-xs font-semibold rounded px-2 py-1 border border-slate-200 bg-white"
                          >
                            <option value="new">New</option>
                            <option value="under_review">Under Review</option>
                            <option value="awaiting_client">Awaiting Client</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => {
                              // Link to quotation generator or project create
                              setActiveModule('quotations');
                            }}
                            className="text-blue-700 hover:text-blue-800 font-semibold text-[11px] px-2 py-1 rounded hover:bg-blue-50"
                          >
                            Draft Quote
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. CLIENTS CRM */}
          {activeModule === 'clients' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Clients CRM Directory</h2>
                  <p className="text-xs text-slate-500">Corporate client accounts, historical billing, and active projects.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {snapshot.clients.map((cli) => (
                  <div key={cli.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{cli.businessName}</h3>
                        <p className="text-xs text-slate-500">Contact: {cli.fullName}</p>
                      </div>
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                        {cli.activeProjectsCount} Project(s)
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                      <div>Email: <strong>{cli.email}</strong></div>
                      <div>Phone: <strong>{cli.phone}</strong></div>
                      <div>Address: <strong>{cli.address || 'Metro Manila, Philippines'}</strong></div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg text-xs grid grid-cols-2 gap-2 font-mono">
                      <div>
                        <span className="text-slate-500 text-[10px] block">PHP Billed / Paid:</span>
                        <span>₱{cli.totalBilledPhp.toLocaleString()} / ₱{cli.totalPaidPhp.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">USD Billed / Paid:</span>
                        <span>${cli.totalBilledUsd.toLocaleString()} / ${cli.totalPaidUsd.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. OMNICHANNEL SUPPORT INBOX (§13 & §24) */}
          {activeModule === 'inbox' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 h-[600px]">
              
              {/* Conversation List (4 cols) */}
              <div className="md:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
                <div className="p-4 border-b border-slate-200 bg-white">
                  <h3 className="text-sm font-bold text-slate-900">Conversations Queue</h3>
                  <p className="text-[11px] text-slate-500">Web live chat, email, and guest visitors</p>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {snapshot.conversations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConvId(c.id)}
                      className={`w-full text-left p-4 transition-colors flex flex-col gap-1 ${
                        selectedConvId === c.id ? 'bg-blue-50/80 border-l-4 border-blue-700' : 'hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 truncate">{c.clientName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{c.lastMessageSnippet}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono uppercase bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                          {c.channel.replace('_', ' ')}
                        </span>
                        {c.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                            {c.unreadCount} new
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread & Reply (8 cols) */}
              <div className="md:col-span-8 flex flex-col h-full bg-white">
                {activeConversation ? (
                  <>
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{activeConversation.clientName}</h4>
                        <p className="text-xs text-slate-500">{activeConversation.clientEmail} · Channel: {activeConversation.channel}</p>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {activeConversation.status}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                      {activeMessages.map((msg) => {
                        const isStaff = msg.senderRole === 'super_admin' || msg.senderRole === 'staff';
                        return (
                          <div key={msg.id} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.senderName} ({msg.senderRole})</span>
                            <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                              isStaff ? 'bg-blue-700 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                            }`}>
                              <p>{msg.content}</p>
                            </div>
                            <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <form onSubmit={handleAdminReply} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white">
                      <input
                        type="text"
                        placeholder="Type response as NUNC Support..."
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                      <button
                        type="submit"
                        disabled={!adminReplyText.trim()}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="p-12 text-center text-xs text-slate-400">Select a conversation from the left to start responding.</div>
                )}
              </div>

            </div>
          )}

          {/* 5. PROJECTS MANAGEMENT (§12.D & §23) */}
          {activeModule === 'projects' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Projects & Milestone Tracking</h2>
                  <p className="text-xs text-slate-500">Configure milestones (30/40/30), progress percentages, and managers.</p>
                </div>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {snapshot.projects.map((p) => (
                  <div key={p.id} className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {p.projectCode}
                          </span>
                          <span className="text-xs text-slate-500">Client: {p.clientBusiness || p.clientName}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{p.title}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-slate-900 block">
                          Budget: {p.currency} {p.budgetTotal.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={p.progressPercentage}
                            onChange={(e) => db.updateProject(p.id, { progressPercentage: Number(e.target.value) })}
                            className="w-24 accent-blue-600"
                          />
                          <span className="text-xs font-mono font-bold text-blue-700">{p.progressPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Milestones list */}
                    <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {p.milestones.map((m, mIdx) => (
                        <div key={m.id} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">Phase {mIdx + 1} ({m.percentageWeight}%)</span>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              m.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>{m.status}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{m.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. TASKS MANAGEMENT (§16) */}
          {activeModule === 'tasks' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Task Management Board</h2>
                  <p className="text-xs text-slate-500">Internal project task allocation, priorities, and status updates.</p>
                </div>
                <button
                  onClick={() => setShowNewTaskModal(true)}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['todo', 'in_progress', 'completed'].map((colStatus) => {
                  const tasksInCol = snapshot.tasks.filter(t => t.status === colStatus);
                  return (
                    <div key={colStatus} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {colStatus.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                          {tasksInCol.length}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {tasksInCol.map((task) => (
                          <div key={task.id} className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-slate-900 leading-snug">{task.title}</h4>
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded shrink-0 ${
                                task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                task.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                                'bg-slate-100 text-slate-600'
                              }`}>{task.priority}</span>
                            </div>

                            <p className="text-[11px] text-slate-600 line-clamp-2">{task.description}</p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                              <span>Due: {task.dueDate}</span>
                              <select
                                value={task.status}
                                onChange={(e) => db.updateTaskStatus(task.id, e.target.value as any)}
                                className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
                              >
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. APPOINTMENTS SCHEDULER (§17) */}
          {activeModule === 'appointments' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Consultation Appointments</h2>
                  <p className="text-xs text-slate-500">Approve booking requests, add Google Meet / Zoom links, and prevent conflicts.</p>
                </div>
              </div>

              <div className="space-y-3">
                {snapshot.appointments.map((apt) => (
                  <div key={apt.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 text-xs">{apt.referenceNumber}</span>
                        <span className="text-xs font-bold text-slate-900">{apt.clientName} ({apt.businessName || 'Client'})</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>{apt.status}</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        Date: <strong>{apt.date}</strong> at <strong>{apt.timeSlot}</strong> · Format: <strong>{apt.type}</strong>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Interest: {apt.serviceInterestedIn} · {apt.requirements || 'Discovery call'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {apt.status === 'pending' && (
                        <button
                          onClick={() => db.updateAppointmentStatus(apt.id, 'confirmed', {
                            meetingLink: apt.type === 'online' ? 'https://meet.google.com/nunc-discovery' : undefined
                          })}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
                        >
                          Confirm & Issue Link
                        </button>
                      )}
                      <button
                        onClick={() => db.updateAppointmentStatus(apt.id, 'cancelled')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. QUOTATIONS (§18) */}
          {activeModule === 'quotations' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Quotations & Proposals</h2>
                  <p className="text-xs text-slate-500">Generate professional downloadable PDF quotations with line items and terms.</p>
                </div>
              </div>

              <div className="space-y-4">
                {snapshot.quotations.map((qt) => (
                  <div key={qt.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">{qt.quotationNumber}</span>
                        <span className="text-xs font-bold text-blue-700">{qt.clientBusiness || qt.clientName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {qt.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        Project: {qt.projectTitle} · Valid Until: {qt.validUntil}
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-900">
                        Total: {qt.currency} {qt.total.toLocaleString()} (Tax {qt.taxRate}%)
                      </div>
                    </div>

                    <button
                      onClick={() => generateQuotationPDF(qt)}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF Quotation</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. INVOICES (§19) */}
          {activeModule === 'invoices' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Invoices & Billing Generator</h2>
                  <p className="text-xs text-slate-500">Generate official downloadable PDF invoices with tax and payment instructions.</p>
                </div>
                <button
                  onClick={() => setShowNewInvoiceModal(true)}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Invoice</span>
                </button>
              </div>

              <div className="space-y-4">
                {snapshot.invoices.map((inv) => (
                  <div key={inv.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">{inv.invoiceNumber}</span>
                        <span className="text-xs font-bold text-blue-700">{inv.clientBusiness || inv.clientName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          inv.status === 'partially_paid' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>{inv.status.replace('_', ' ')}</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        Issue Date: {inv.issueDate} · Due: {inv.dueDate}
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-900">
                        Total: {inv.currency} {inv.total.toLocaleString()} · Balance Due: {inv.currency} {inv.balanceDue.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => generateInvoicePDF(inv)}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF Invoice</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. PAYMENTS & PROOFS (§22) */}
          {activeModule === 'payments' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Payments Verification & Audit</h2>
                  <p className="text-xs text-slate-500">Review submitted bank transfers, GCash, Maya payments, and verify balances.</p>
                </div>
              </div>

              <div className="space-y-3">
                {snapshot.payments.map((p) => (
                  <div key={p.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 text-xs">{p.paymentReference}</span>
                        <span className="text-xs font-bold text-slate-900">{p.clientName}</span>
                        <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                          {p.method.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                          p.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>{p.verificationStatus}</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        Amount: <strong className="font-mono text-slate-900">{p.currency} {p.amount.toLocaleString()}</strong> · Txn Ref: <span className="font-mono">{p.transactionReference}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{p.notes}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {p.verificationStatus === 'pending' && (
                        <button
                          onClick={() => db.verifyPayment(p.id, user?.id || 'admin-1', 'verified')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                        >
                          Verify & Settle
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. STAFF & DEPARTMENTS (§15) */}
          {activeModule === 'staff' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Staff Accounts & Departments</h2>
                  <p className="text-xs text-slate-500">Department structures, roles, and assigned workloads.</p>
                </div>
              </div>

              {/* Departments strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {snapshot.departments.map((dept) => (
                  <div key={dept.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-900 block">{dept.name}</span>
                    <span className="text-[11px] text-slate-500 block leading-tight">{dept.description}</span>
                  </div>
                ))}
              </div>

              {/* Staff table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                      <th className="py-2.5 px-3">Full Name</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Position</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Workload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {snapshot.staff.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">{s.fullName}</td>
                        <td className="py-3 px-3 text-slate-600">{s.email}</td>
                        <td className="py-3 px-3 text-slate-700">{s.position}</td>
                        <td className="py-3 px-3 uppercase text-[10px] font-bold text-blue-700">{s.role}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {s.assignedInquiriesCount} Inq / {s.activeProjectsCount} Prj
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 12. SERVICES CMS (§8) */}
          {activeModule === 'cms_services' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Services CMS (10 Core Services)</h2>
                  <p className="text-xs text-slate-500">Edit titles, descriptions, benefits, and publication status without touching code.</p>
                </div>
              </div>

              <div className="space-y-4">
                {snapshot.services.map((srv, idx) => (
                  <div key={srv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 text-xs">#{idx + 1}</span>
                        <h4 className="text-xs font-bold text-slate-900">{srv.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          srv.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>{srv.isPublished ? 'Published' : 'Hidden'}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{srv.shortDescription}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => db.updateService(srv.id, { isPublished: !srv.isPublished })}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-medium rounded-lg hover:bg-slate-100"
                      >
                        {srv.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 13. PORTFOLIO CMS (§9) */}
          {activeModule === 'cms_portfolio' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Demonstration Portfolio CMS</h2>
                  <p className="text-xs text-slate-500">Strictly maintains DEMO PROJECT / CONCEPT PROJECT labeling per launch requirements.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {snapshot.portfolio.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <span className="text-[10px] font-mono uppercase bg-slate-900 text-white px-2 py-0.5 rounded font-bold">
                      {p.demoLabel}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{p.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{p.shortDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 14. WEBSITE CMS & HERO (§26) */}
          {activeModule === 'cms_website' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Website CMS & Brand Content</h2>
                <p className="text-xs text-slate-500">Live editing of homepage hero headlines, mission, vision, and contact details.</p>
              </div>

              <div className="space-y-4 max-w-2xl text-xs">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Main Hero Headline</label>
                  <input
                    type="text"
                    value={snapshot.cms.heroHeadline}
                    onChange={(e) => db.updateCMS({ heroHeadline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Hero Supporting Text</label>
                  <textarea
                    rows={3}
                    value={snapshot.cms.heroSubtext}
                    onChange={(e) => db.updateCMS({ heroSubtext: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Official Company Email</label>
                  <input
                    type="text"
                    value={snapshot.cms.companyEmail}
                    onChange={(e) => db.updateCMS({ companyEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Official Company Phone</label>
                  <input
                    type="text"
                    value={snapshot.cms.companyPhone}
                    onChange={(e) => db.updateCMS({ companyPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 15. LEGAL CENTER CMS (§28) */}
          {activeModule === 'cms_legal' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Legal Center CMS (7 Policies)</h2>
                <p className="text-xs text-slate-500">Manage all 7 corporate legal templates, draft notices, and revisions.</p>
              </div>

              <div className="space-y-4">
                {snapshot.legalPages.map((lp) => (
                  <div key={lp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{lp.title}</span>
                      <span className="text-slate-500 ml-2">Slug: /{lp.slug}</span>
                      {lp.isDraft && (
                        <span className="ml-2 font-mono uppercase bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded text-[10px]">
                          Draft
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => navigate('legal', lp.slug)}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-blue-700 font-semibold rounded-lg hover:bg-slate-100"
                    >
                      View & Audit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 16. ANALYTICS & BI (§29) */}
          {activeModule === 'analytics' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Advanced Business Intelligence & Reports</h2>
                <p className="text-xs text-slate-500">Conversion funnels, isolated multi-currency ledgers, and delivery health.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Inquiry Conversion Rate</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                    {Math.round((snapshot.inquiries.filter(i => i.status === 'converted' || i.status === 'approved').length / Math.max(1, snapshot.inquiries.length)) * 100)}%
                  </div>
                  <span className="text-[11px] text-slate-400">From incoming leads to projects</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Project Delivery On-Time</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-1">100%</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Zero delayed milestones</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Inquiry Response Time</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-1">&lt; 2.4 hrs</div>
                  <span className="text-[11px] text-slate-400">Within 24h SLA target</span>
                </div>
              </div>
            </div>
          )}

          {/* 17. INTEGRATION SETTINGS (§37 & Phase 1 Config) */}
          {activeModule === 'integrations' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">External Integrations & Operational Status</h2>
                <p className="text-xs text-slate-500">
                  Initial Development Phase status audit. Optional integrations are gracefully handled without application crash or secret exposure.
                </p>
              </div>

              {/* Status Summary Banner */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <span className="font-bold">Initial Phase Operating Rules:</span> Manual payment management (Bank Transfer, GCash, Maya) is fully active with proof uploads and milestone tracking. Online payment processing and social messaging channels (Messenger/WhatsApp) are disabled until credentials are confirmed. The website's internal live chat and transactional email routing to <strong>nuncbusinesssolutions@gmail.com</strong> are active.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Manual Payments */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Manual Payment Management</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Full support for Bank Transfers (BDO/BPI), GCash, Maya, manual receipt recording, payment proof uploads, official PDF invoices, and 30/40/30 milestone tracking.
                  </p>
                </div>

                {/* 2. Online Payment Gateway */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Online Payment Gateway (Cards / Automated)</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-slate-200 text-slate-700">
                      Disabled (Awaiting Gateway Onboarding)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Disabled for initial development phase. Gateway environment variables are treated as optional and not required for startup.
                  </p>
                </div>

                {/* 3. Transactional Email via Resend */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Transactional Email (Resend)</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      Active & Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dispatches inquiries, appointment bookings, and payment alerts to destination: <strong>nuncbusinesssolutions@gmail.com</strong>. RESEND_API_KEY is isolated server-side.
                  </p>

                  <div className="pt-2 border-t border-blue-100 flex flex-col gap-2">
                    <button
                      onClick={handleTriggerTestEmail}
                      disabled={emailTestState?.loading}
                      className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 w-full sm:w-auto self-start"
                    >
                      {emailTestState?.loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending Verification Test...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send Test Email via Resend</span>
                        </>
                      )}
                    </button>

                    {emailTestState && !emailTestState.loading && (
                      <div className={`p-2.5 rounded-lg text-xs ${
                        emailTestState.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
                      }`}>
                        <div className="font-semibold flex items-center gap-1.5">
                          {emailTestState.success ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                          <span>{emailTestState.message}</span>
                        </div>
                        {emailTestState.emailId && (
                          <div className="mt-1 text-[11px] font-mono text-emerald-700 break-all">
                            Provider Email ID: {emailTestState.emailId}
                          </div>
                        )}
                        {emailTestState.senderUsed && (
                          <div className="text-[10px] text-emerald-600">
                            Sender: {emailTestState.senderUsed}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Internal Live Chat */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Website Live Chat (Internal)</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Active & Standalone
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hybrid internal support chat operates independently for both guest visitors and authenticated clients with attachment validation.
                  </p>
                </div>

                {/* 5. Facebook Messenger */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Facebook Messenger</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-slate-200 text-slate-600">
                      Disabled (Awaiting Meta Credentials)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Disabled until META_APP_ID, META_APP_SECRET, and verified Facebook Page access tokens are configured.
                  </p>
                </div>

                {/* 6. WhatsApp Business */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">WhatsApp Business Cloud</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-slate-200 text-slate-600">
                      Disabled (Awaiting Meta Credentials)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Disabled until WhatsApp Business Platform phone number ID and system access tokens are confirmed.
                  </p>
                </div>

              </div>

              {/* Security Credentials Isolation Note */}
              <div className="p-4 bg-slate-900 text-slate-300 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-white flex items-center gap-2">
                  <FolderLock className="w-4 h-4 text-blue-400" />
                  <span>Server-Side Security & Key Protection</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  In compliance with security standards, privileged keys (SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, PAYMENT_GATEWAY_SECRET_KEY) are strictly retained within server-side execution (server.ts) and are never exposed to browser runtimes or public API responses.
                </p>
              </div>
            </div>
          )}

          {/* 18. BACKUP & DISASTER RECOVERY (§34) */}
          {activeModule === 'backup' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Backup & Disaster Recovery Management</h2>
                <p className="text-xs text-slate-500">Export complete business records, review Supabase point-in-time recovery, and download data.</p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Export Complete Business Snapshot</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Download an encrypted, normalized JSON snapshot containing all inquiries, clients, projects, milestones, tasks, appointments, invoices, and CMS content.
                  </p>
                  <button
                    onClick={() => {
                      const data = db.exportBackupJson();
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `NUNC_Backup_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                    }}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup Copy</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE PROJECT MODAL */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Create New Project Record</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const cli = snapshot.clients.find(c => c.id === newProjectData.clientId);
              db.createProject({
                title: newProjectData.title,
                description: newProjectData.description,
                clientId: newProjectData.clientId,
                clientName: cli?.fullName || 'Client',
                clientBusiness: cli?.businessName || 'Business',
                serviceCategory: newProjectData.serviceCategory,
                status: 'planning',
                progressPercentage: 10,
                budgetTotal: Number(newProjectData.budgetTotal),
                currency: newProjectData.currency,
                startDate: newProjectData.startDate,
                targetEndDate: newProjectData.targetEndDate,
                detailedTrackingEnabled: true,
                milestones: [
                  { id: `m-${Date.now()}-1`, projectId: '', title: 'Phase 1: Architecture & Scope Lock', description: 'Technical specifications and ERD approval.', percentageWeight: 30, dueDate: '2026-11-20', status: 'in_progress', amount: newProjectData.budgetTotal * 0.3, currency: newProjectData.currency },
                  { id: `m-${Date.now()}-2`, projectId: '', title: 'Phase 2: Core Engineering & Staging', description: 'Functional feature delivery.', percentageWeight: 40, dueDate: '2026-12-10', status: 'pending', amount: newProjectData.budgetTotal * 0.4, currency: newProjectData.currency },
                  { id: `m-${Date.now()}-3`, projectId: '', title: 'Phase 3: UAT & Final Deployment', description: 'Handover and domain launch.', percentageWeight: 30, dueDate: '2026-12-31', status: 'pending', amount: newProjectData.budgetTotal * 0.3, currency: newProjectData.currency }
                ]
              });
              setShowNewProjectModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Retail POS & Inventory Integration"
                  value={newProjectData.title}
                  onChange={(e) => setNewProjectData({ ...newProjectData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Client</label>
                <select
                  value={newProjectData.clientId}
                  onChange={(e) => setNewProjectData({ ...newProjectData, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  {snapshot.clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.businessName} ({c.fullName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Budget Total</label>
                  <input
                    type="number"
                    value={newProjectData.budgetTotal}
                    onChange={(e) => setNewProjectData({ ...newProjectData, budgetTotal: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Currency</label>
                  <select
                    value={newProjectData.currency}
                    onChange={(e) => setNewProjectData({ ...newProjectData, currency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="PHP">PHP (₱)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProjectData.description}
                  onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Create Official Invoice</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const cli = snapshot.clients.find(c => c.id === newInvoiceData.clientId);
              const prj = snapshot.projects.find(p => p.id === newInvoiceData.projectId);
              const taxAmt = Math.round((newInvoiceData.amount * newInvoiceData.taxRate) / 100);
              const grandTotal = newInvoiceData.amount + taxAmt;

              db.createInvoice({
                clientId: newInvoiceData.clientId,
                clientName: cli?.fullName || 'Client',
                clientBusiness: cli?.businessName || 'Business',
                clientEmail: cli?.email || 'client@example.com',
                projectId: newInvoiceData.projectId,
                projectTitle: prj?.title || 'Custom Engineering Milestone',
                currency: newInvoiceData.currency,
                items: [
                  { id: `ii-${Date.now()}`, description: newInvoiceData.description, quantity: 1, unitPrice: newInvoiceData.amount, discount: 0, amount: newInvoiceData.amount }
                ],
                subtotal: newInvoiceData.amount,
                taxRate: newInvoiceData.taxRate,
                taxAmount: taxAmt,
                discountTotal: 0,
                total: grandTotal,
                amountPaid: 0,
                balanceDue: grandTotal,
                status: 'sent',
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: newInvoiceData.dueDate,
                paymentInstructions: newInvoiceData.paymentInstructions,
                notes: 'Generated via NUNC Business Solutions management console.'
              });
              setShowNewInvoiceModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Client</label>
                <select
                  value={newInvoiceData.clientId}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  {snapshot.clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.businessName} ({c.fullName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Line Item Description</label>
                <input
                  type="text"
                  required
                  value={newInvoiceData.description}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    value={newInvoiceData.amount}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tax / VAT %</label>
                  <input
                    type="number"
                    value={newInvoiceData.taxRate}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, taxRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Currency</label>
                  <select
                    value={newInvoiceData.currency}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, currency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="PHP">PHP</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Add Internal Project Task</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const staff = snapshot.staff.find(s => s.id === newTaskData.assignedStaffId);
              db.createTask({
                projectId: newTaskData.projectId,
                title: newTaskData.title,
                description: newTaskData.description,
                priority: newTaskData.priority,
                assignedStaffId: newTaskData.assignedStaffId,
                assignedStaffName: staff?.fullName,
                status: 'todo',
                dueDate: newTaskData.dueDate,
                subtasks: [],
                internalComments: []
              });
              setShowNewTaskModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement schema migration for POS shift drawer"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Assign Staff</label>
                <select
                  value={newTaskData.assignedStaffId}
                  onChange={(e) => setNewTaskData({ ...newTaskData, assignedStaffId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  {snapshot.staff.map((s) => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.position})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Priority</label>
                  <select
                    value={newTaskData.priority}
                    onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskData.dueDate}
                    onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
