import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/database';
import { generateInvoicePDF, generateQuotationPDF } from '../../lib/pdfGenerator';
import {
  Inquiry,
  Project,
  Invoice,
  Quotation,
  DocumentItem,
  ChatMessage,
  PaymentRecord
} from '../../lib/types';
import {
  User,
  Building,
  Mail,
  Phone,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Send,
  Paperclip,
  FolderLock,
  CreditCard,
  Upload,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ClientPortalProps {
  navigate: (route: string) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ navigate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'inquiries' | 'documents' | 'invoices' | 'messages' | 'profile'>('overview');

  const [snapshot, setSnapshot] = useState(db.getSnapshot());

  useEffect(() => {
    const handleUpdate = () => setSnapshot(db.getSnapshot());
    window.addEventListener('nunc_db_updated', handleUpdate);
    return () => window.removeEventListener('nunc_db_updated', handleUpdate);
  }, []);

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-slate-600">Please sign in to access your Client Portal.</p>
        <button
          onClick={() => navigate('login')}
          className="px-6 py-2.5 bg-blue-700 text-white rounded-lg text-xs font-semibold"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Filter records strictly belonging to this client (or match email)
  const clientInquiries = snapshot.inquiries.filter(
    i => i.email.toLowerCase() === user.email.toLowerCase() || i.clientId === user.id
  );

  const clientProjects = snapshot.projects.filter(
    p => p.clientId === user.id || p.clientName.toLowerCase() === user.fullName.toLowerCase()
  );

  const clientInvoices = snapshot.invoices.filter(
    i => i.clientId === user.id || i.clientEmail.toLowerCase() === user.email.toLowerCase()
  );

  const clientQuotations = snapshot.quotations.filter(
    q => q.clientId === user.id || q.clientEmail.toLowerCase() === user.email.toLowerCase()
  );

  const clientDocuments = snapshot.documents.filter(
    d => d.clientId === user.id || d.clientName.toLowerCase() === user.fullName.toLowerCase()
  );

  // Active client conversation
  const clientConversation = snapshot.conversations.find(
    c => c.clientEmail.toLowerCase() === user.email.toLowerCase() || c.clientId === user.id
  );

  const clientMessages = clientConversation
    ? snapshot.messages.filter(m => m.conversationId === clientConversation.id)
    : [];

  // Chat input
  const [messageText, setMessageText] = useState('');

  // Payment proof form modal
  const [showPaymentModal, setShowPaymentModal] = useState<Invoice | null>(null);
  const [payMethod, setPayMethod] = useState<'bank_transfer' | 'gcash' | 'maya'>('bank_transfer');
  const [payRefNumber, setPayRefNumber] = useState('');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paySuccessMsg, setPaySuccessMsg] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    let convId = clientConversation?.id;
    if (!convId) {
      const newConv = db.getOrCreateGuestConversation(user.fullName, user.email);
      convId = newConv.id;
    }

    db.sendMessage(
      convId,
      user.id,
      user.fullName,
      'client',
      messageText.trim()
    );
    setMessageText('');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPaymentModal || !payRefNumber.trim()) return;

    db.recordPayment({
      invoiceId: showPaymentModal.id,
      invoiceNumber: showPaymentModal.invoiceNumber,
      projectId: showPaymentModal.projectId,
      projectTitle: showPaymentModal.projectTitle,
      clientId: user.id,
      clientName: user.fullName,
      amount: payAmount || showPaymentModal.balanceDue || showPaymentModal.total,
      currency: showPaymentModal.currency,
      paymentDate: new Date().toISOString().split('T')[0],
      method: payMethod,
      transactionReference: payRefNumber.trim(),
      notes: `Submitted by client ${user.fullName} via Client Portal.`
    });

    setPaySuccessMsg(true);
    setTimeout(() => {
      setPaySuccessMsg(false);
      setShowPaymentModal(null);
      setPayRefNumber('');
    }, 1500);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Welcome Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase bg-blue-600/40 text-blue-300 px-2.5 py-0.5 rounded border border-blue-500/30">
              Authenticated Client Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome, {user.fullName}
          </h1>
          <p className="text-xs text-slate-400">
            {user.businessName || 'Enterprise Client'} · {user.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('inquiries')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Submit New Inquiry
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'projects', label: `Projects (${clientProjects.length})` },
          { id: 'inquiries', label: `Inquiries (${clientInquiries.length})` },
          { id: 'invoices', label: `Invoices & Billing (${clientInvoices.length})` },
          { id: 'documents', label: `Document Vault (${clientDocuments.length})` },
          { id: 'messages', label: `Support Messaging (${clientMessages.length})` },
          { id: 'profile', label: 'Company Profile' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Active Projects</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{clientProjects.length}</div>
              <span className="text-[11px] text-slate-400">Milestone tracked</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Submitted Inquiries</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{clientInquiries.length}</div>
              <span className="text-[11px] text-slate-400">Under review or active</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Invoiced Documents</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{clientInvoices.length}</div>
              <span className="text-[11px] text-slate-400">Downloadable official PDFs</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Authorized Files</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{clientDocuments.length}</div>
              <span className="text-[11px] text-slate-400">Proposals & deliverables</span>
            </div>
          </div>

          {/* Active Projects Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Current Active Projects</h3>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800"
              >
                View Details &rarr;
              </button>
            </div>

            {clientProjects.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                You do not have any active projects yet. Submit an inquiry to initiate a project!
              </div>
            ) : (
              <div className="space-y-4">
                {clientProjects.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                          {p.projectCode}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{p.title}</h4>
                      </div>
                      <span className="text-xs font-semibold capitalize text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                        Status: {p.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>Milestone Progress</span>
                        <span className="font-mono font-bold">{p.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${p.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {clientProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              No projects associated with your account yet.
            </div>
          ) : (
            clientProjects.map((prj) => (
              <div key={prj.id} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {prj.projectCode}
                      </span>
                      <span className="text-xs text-slate-500">
                        Category: {prj.serviceCategory}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      {prj.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-2xl">
                      {prj.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                      Overall Progress
                    </span>
                    <div className="text-2xl font-mono font-bold text-blue-700">
                      {prj.progressPercentage}%
                    </div>
                  </div>
                </div>

                {/* Milestones Tracking (§12.D) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Project Milestones & Delivery Schedule
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {prj.milestones.map((m, mIdx) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            m.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : m.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {m.status === 'completed' ? '✓' : mIdx + 1}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{m.title}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{m.description}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-medium shrink-0">
                          <span className="text-slate-500 font-mono">Due: {m.dueDate}</span>
                          <span className="text-blue-700 font-mono font-bold">{m.percentageWeight}% Weight</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {m.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Submitted Inquiries</h3>
            <button
              onClick={() => navigate('contact')}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
            >
              Submit New Inquiry
            </button>
          </div>

          {clientInquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              You haven't submitted any project inquiries yet.
            </div>
          ) : (
            <div className="space-y-3">
              {clientInquiries.map((inq) => (
                <div key={inq.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {inq.referenceNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {inq.serviceName}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase self-start sm:self-auto ${
                      inq.status === 'approved' || inq.status === 'converted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inq.status === 'under_review'
                        ? 'bg-blue-100 text-blue-800'
                        : inq.status === 'new'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {inq.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {inq.requirements}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span>Budget Parameter: <strong>{inq.budgetRange}</strong></span>
                    <span>Submitted: {new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INVOICES & BILLING */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Issued Invoices & Quotations</h3>
          </div>

          {clientInvoices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              No invoices generated for your account yet.
            </div>
          ) : (
            <div className="space-y-4">
              {clientInvoices.map((inv) => (
                <div key={inv.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {inv.invoiceNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'partially_paid'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Due Date: {inv.dueDate} · Project: {inv.projectTitle || 'Custom Service'}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500">Total Amount</div>
                      <div className="text-lg font-mono font-bold text-slate-900">
                        {inv.currency} {inv.total.toLocaleString()}
                      </div>
                      {inv.balanceDue > 0 && (
                        <div className="text-xs font-mono text-red-600 font-semibold">
                          Balance Due: {inv.currency} {inv.balanceDue.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: Download PDF and Upload Proof */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-slate-500">
                      Payment instructions: Bank Transfer (BDO/BPI), GCash, Maya
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => generateInvoicePDF(inv)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF Invoice</span>
                      </button>

                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => {
                            setShowPaymentModal(inv);
                            setPayAmount(inv.balanceDue);
                          }}
                          className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Submit Payment Proof</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: DOCUMENT VAULT (§12.E) */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Authorized Client Documents</h3>
            <span className="text-xs text-slate-500">Isolated & Access Controlled</span>
          </div>

          {clientDocuments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              No private documents uploaded to your vault yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientDocuments.map((doc) => (
                <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between gap-4 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {doc.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{doc.title}</h4>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {doc.fileName} · {doc.fileSize}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // Trigger client invoice/quotation PDF or simulated download
                      const relatedInv = clientInvoices[0];
                      if (relatedInv) generateInvoicePDF(relatedInv);
                      else alert(`Downloading authorized file: ${doc.fileName}`);
                    }}
                    className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                    title="Download authorized document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: MESSAGES (§12.C) */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[520px]">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold">Direct Messaging with NUNC Project Team</h3>
              <p className="text-[11px] text-slate-400">Assigned engineers & client success managers</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
            {clientMessages.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                No messages yet. Send a note below to connect with your project manager.
              </div>
            ) : (
              clientMessages.map((msg) => {
                const isMe = msg.senderRole === 'client';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.senderName}</span>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe ? 'bg-blue-700 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                    }`}>
                      <p>{msg.content}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a message to NUNC project managers..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 max-w-2xl shadow-xs">
          <h3 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100">
            Client Organization Profile
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-500 font-medium">Full Name</label>
              <div className="font-semibold text-slate-900 mt-0.5">{user.fullName}</div>
            </div>
            <div>
              <label className="text-slate-500 font-medium">Business / Entity Name</label>
              <div className="font-semibold text-slate-900 mt-0.5">{user.businessName || 'N/A'}</div>
            </div>
            <div>
              <label className="text-slate-500 font-medium">Registered Email</label>
              <div className="font-semibold text-slate-900 mt-0.5">{user.email}</div>
            </div>
            <div>
              <label className="text-slate-500 font-medium">Contact Number</label>
              <div className="font-semibold text-slate-900 mt-0.5">{user.phone || '09161669188'}</div>
            </div>
            <div>
              <label className="text-slate-500 font-medium">Account Authority</label>
              <div className="font-semibold text-slate-900 mt-0.5 capitalize">{user.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT PAYMENT PROOF */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">
              Submit Payment Proof for {showPaymentModal.invoiceNumber}
            </h3>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
              <span className="font-bold">Initial Phase Payment Process:</span> Online credit card gateway processing is disabled. Manual settlement via <strong>Bank Transfer (BDO/BPI)</strong>, <strong>GCash</strong>, and <strong>Maya</strong> is active. Please enter your deposit/wallet reference below to notify our accounts team.
            </div>

            {paySuccessMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs text-center font-semibold">
                ✓ Payment proof logged! NUNC finance team has been notified for verification.
              </div>
            ) : (
              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    <option value="bank_transfer">Bank Transfer (BDO / BPI)</option>
                    <option value="gcash">GCash</option>
                    <option value="maya">Maya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Transaction / Deposit Reference Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BDO-REF-123456 or GCash Ref"
                    value={payRefNumber}
                    onChange={(e) => setPayRefNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Amount Paid ({showPaymentModal.currency})</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Confirm Submission
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
