import React, { useState } from 'react';
import { db } from '../../lib/database';
import { Appointment } from '../../lib/types';
import { Calendar as CalendarIcon, Clock, Video, MapPin, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface ConsultationPageProps {
  navigate: (route: string) => void;
}

export const ConsultationPage: React.FC<ConsultationPageProps> = ({ navigate }) => {
  const snapshot = db.getSnapshot();
  const services = snapshot.services.filter(s => s.isPublished);

  const availableTimeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM'
  ];

  // Pick tomorrow's date by default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    businessName: '',
    serviceInterestedIn: services[0]?.name || 'Custom Business Management Systems',
    type: 'online' as Appointment['type'],
    date: defaultDateStr,
    timeSlot: availableTimeSlots[1],
    timeZone: 'Asia/Manila (GMT+8)',
    requirements: ''
  });

  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = db.bookAppointment({
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim(),
        clientPhone: formData.clientPhone.trim(),
        businessName: formData.businessName.trim(),
        serviceInterestedIn: formData.serviceInterestedIn,
        type: formData.type,
        meetingPlatform: formData.type === 'online' ? 'Google Meet' : undefined,
        locationAddress: formData.type === 'in_person' ? 'NUNC Partner Meeting Suite, BGC, Taguig City, Metro Manila' : undefined,
        date: formData.date,
        timeSlot: formData.timeSlot,
        timeZone: formData.timeZone,
        requirements: formData.requirements.trim()
      });

      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.error || 'The selected time slot is unavailable.');
      } else if (res.appointment) {
        setBookedAppointment(res.appointment);
      }
    }, 400);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-blue-700">
          Executive Discovery Session
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Book a Consultation Meeting
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Schedule a dedicated session with NUNC system architects to audit your existing operations, review technical prerequisites, and plan your custom business solution.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        {bookedAppointment ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">
                Consultation Request Logged
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{bookedAppointment.clientName}</strong>. Your consultation request has been reserved in our schedule. Our team will review the requirements and confirm the meeting invite.
              </p>
            </div>

            {/* Reference Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Booking Reference:</span>
                <span className="font-mono text-sm font-bold text-blue-700">{bookedAppointment.referenceNumber}</span>
              </div>
              <div className="text-xs text-slate-700 space-y-1 pt-2 border-t border-slate-200">
                <div><strong>Type:</strong> {bookedAppointment.type === 'online' ? 'Online Video Call (Google Meet)' : 'In-Person Consultation'}</div>
                <div><strong>Date:</strong> {bookedAppointment.date}</div>
                <div><strong>Time:</strong> {bookedAppointment.timeSlot} ({bookedAppointment.timeZone})</div>
                <div><strong>Status:</strong> <span className="text-amber-700 font-semibold uppercase text-[11px]">Pending Staff Confirmation</span></div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('contact')}
                className="px-6 py-2.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800"
              >
                Send Additional Project Details
              </button>
              <button
                onClick={() => setBookedAppointment(null)}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
              >
                Book Another Slot
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Schedule Conflict:</span> {errorMessage}
                </div>
              </div>
            )}

            {/* Consultation Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Consultation Format <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    formData.type === 'online'
                      ? 'bg-blue-50 border-blue-600 text-blue-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="consultationType"
                    checked={formData.type === 'online'}
                    onChange={() => setFormData({ ...formData, type: 'online' })}
                    className="sr-only"
                  />
                  <Video className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">Online Video Consultation</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Google Meet / Zoom meeting link will be generated.</div>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    formData.type === 'in_person'
                      ? 'bg-blue-50 border-blue-600 text-blue-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="consultationType"
                    checked={formData.type === 'in_person'}
                    onChange={() => setFormData({ ...formData, type: 'in_person' })}
                    className="sr-only"
                  />
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">In-Person Consultation</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">NUNC Partner Suite, Bonifacio Global City, Taguig.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Date and Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Preferred Date</span> <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Available Time Slot</span> <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  {availableTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Reyes"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Business / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solana Resorts"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Business Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. elena@company.ph"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 09189876543"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Service Interested In
              </label>
              <select
                value={formData.serviceInterestedIn}
                onChange={(e) => setFormData({ ...formData, serviceInterestedIn: e.target.value })}
                className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Key Topics / Technical Bottlenecks to Discuss
              </label>
              <textarea
                rows={3}
                placeholder="Give us an overview of your current challenges or workflows you want to automate..."
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-md"
              >
                {isSubmitting ? 'Checking Schedule & Reserving...' : 'Confirm Consultation Booking'}
              </button>
            </div>

            <div className="text-center text-[11px] text-slate-500">
              * Appointment requests are manually audited to ensure appropriate technical leads are assigned.
            </div>

          </form>
        )}
      </div>

    </div>
  );
};
