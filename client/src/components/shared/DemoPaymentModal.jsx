import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Lock } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import API from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

const DemoPaymentModal = ({ booking, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('DEMO_CARD');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [expiry, setExpiry] = useState('12/30');
  const [cvv, setCvv] = useState('123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await API.post('/payments/process-demo', {
        bookingId: booking._id,
        amount: booking.price,
        paymentMethod
      });
      onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Demo Payment Portal (Simulated Prototype)"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleProcessPayment} className="space-y-6">
        
        {/* Banner Warning */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>DEMO PROTOTYPE PAYMENT PORTAL</span>
          </div>
          <p>No real money or bank accounts are used. Fake demo credentials are auto-filled below for testing.</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Amount */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Shipment Order #{booking.bookingNumber}</span>
            <p className="text-sm font-extrabold text-navy-900">{booking.pickupLocation} → {booking.destinationLocation}</p>
          </div>
          <span className="text-xl font-black text-emerald-600 font-mono">{formatCurrency(booking.price)}</span>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'DEMO_CARD', label: 'Demo Card' },
              { id: 'DEMO_UPI', label: 'Demo UPI' },
              { id: 'DEMO_WALLET', label: 'Demo Wallet' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                  paymentMethod === m.id
                    ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card inputs */}
        {paymentMethod === 'DEMO_CARD' && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Card Number (Demo)</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Expiry</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-center"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} icon={ShieldCheck}>
            Simulate Payment of {formatCurrency(booking.price)}
          </Button>
        </div>

      </form>
    </Modal>
  );
};

export default DemoPaymentModal;
