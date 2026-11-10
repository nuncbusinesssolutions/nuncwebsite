import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/database';
import { Conversation, ChatMessage } from '../lib/types';
import { MessageSquare, X, Send, Paperclip, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [hasStartedGuestSession, setHasStartedGuestSession] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync conversation when user changes or opens
  useEffect(() => {
    const refreshData = () => {
      const snap = db.getSnapshot();
      if (isAuthenticated && user) {
        // Find or create conversation for this logged in client
        const conv = snap.conversations.find(c => c.clientEmail.toLowerCase() === user.email.toLowerCase());
        if (conv) {
          setCurrentConversation(conv);
          setMessages(snap.messages.filter(m => m.conversationId === conv.id));
        }
      } else if (hasStartedGuestSession && guestEmail) {
        const conv = snap.conversations.find(c => c.clientEmail.toLowerCase() === guestEmail.toLowerCase());
        if (conv) {
          setCurrentConversation(conv);
          setMessages(snap.messages.filter(m => m.conversationId === conv.id));
        }
      }
    };

    refreshData();
    window.addEventListener('nunc_db_updated', refreshData);
    return () => window.removeEventListener('nunc_db_updated', refreshData);
  }, [isAuthenticated, user, hasStartedGuestSession, guestEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleStartGuestChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;

    const conv = db.getOrCreateGuestConversation(guestName.trim(), guestEmail.trim());
    setCurrentConversation(conv);
    setHasStartedGuestSession(true);

    // Initial greeting if new
    const snap = db.getSnapshot();
    const existingMsgs = snap.messages.filter(m => m.conversationId === conv.id);
    if (existingMsgs.length === 0) {
      db.sendMessage(
        conv.id,
        'sys-nunc',
        'NUNC Support Team',
        'staff',
        `Hello ${guestName}! Thank you for reaching out to NUNC Business Solutions. How can our team assist you with your business software or technology goals today?`
      );
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentConversation) return;

    const senderId = user ? user.id : 'guest-visitor';
    const senderName = user ? user.fullName : guestName;
    const senderRole = user ? user.role : 'guest';

    db.sendMessage(
      currentConversation.id,
      senderId,
      senderName,
      senderRole,
      inputText.trim()
    );

    setInputText('');
  };

  const handleSimulateAttachment = () => {
    if (!currentConversation) return;
    const senderId = user ? user.id : 'guest-visitor';
    const senderName = user ? user.fullName : guestName;
    const senderRole = user ? user.role : 'guest';

    db.sendMessage(
      currentConversation.id,
      senderId,
      senderName,
      senderRole,
      'Attached document for review: Project_Specifications_Brief.pdf',
      [
        {
          name: 'Project_Specifications_Brief.pdf',
          size: '640 KB',
          url: '#',
          type: 'application/pdf'
        }
      ]
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2.5 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-xl transition-all hover:scale-105 focus:outline-none"
          aria-label="Open Live Chat"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-semibold pr-1">Need help? Chat with NUNC</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                N
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">NUNC Live Support</h3>
                <p className="text-[11px] text-slate-400">Direct consultation & assistance</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
            
            {/* Guest Pre-chat gate */}
            {!isAuthenticated && !hasStartedGuestSession ? (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mt-4">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Start a Conversation</h4>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Please provide your contact info so our technical team can follow up with your inquiry.
                </p>
                <form onSubmit={handleStartGuestChat} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria Santos"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Business Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="maria@company.ph"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors mt-2"
                  >
                    Start Chat Session
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="text-center my-2">
                  <span className="text-[10px] text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                    Encrypted NUNC Session
                  </span>
                </div>

                {messages.map((msg) => {
                  const isMe = user
                    ? msg.senderId === user.id
                    : msg.senderRole === 'guest';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                        {msg.senderName}
                      </span>
                      <div
                        className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-blue-700 text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                        }`}
                      >
                        <p>{msg.content}</p>

                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-blue-600/30 space-y-1">
                            {msg.attachments.map((att, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 p-1.5 bg-black/10 rounded text-[11px]"
                              >
                                <Paperclip className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{att.name}</span>
                                <span className="text-[10px] opacity-75 shrink-0">({att.size})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}

          </div>

          {/* Footer Input */}
          {(isAuthenticated || hasStartedGuestSession) && (
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulateAttachment}
                title="Attach file (PDF/Image)"
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      )}
    </div>
  );
};
