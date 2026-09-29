import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, Building2, Truck, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { GUJARAT_CITIES } from '../../utils/constants';

const RoleSwitchModal = ({ onClose }) => {
  const { user, activeRole, switchRole, createLinkedProfile } = useAuth();
  const navigate = useNavigate();

  const targetRole = activeRole === 'DRIVER' ? 'COMPANY' : 'DRIVER';
  const hasTargetProfile = targetRole === 'COMPANY' ? !!user?.companyProfile : !!user?.driverProfile;

  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(!hasTargetProfile);
  const [errorMsg, setErrorMsg] = useState('');

  // Form state for creating missing profile
  const [formData, setFormData] = useState({
    companyName: user?.name ? `${user.name} Logistics` : '',
    contactPerson: user?.name || '',
    businessType: 'Manufacturer',
    city: 'Surat',
    state: 'Gujarat',
    truckNumber: 'GJ-05-TR-9988',
    truckType: 'Medium Truck',
    capacityTons: 15,
    baseCity: 'Surat'
  });

  const handleDirectSwitch = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await switchRole(targetRole);
      if (res.success) {
        onClose();
        navigate(targetRole === 'DRIVER' ? '/driver/dashboard' : '/company/dashboard');
      } else {
        setShowCreateForm(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Role switch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await createLinkedProfile({
        role: targetRole,
        ...formData
      });
      onClose();
      navigate(targetRole === 'DRIVER' ? '/driver/dashboard' : '/company/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Switch to ${targetRole === 'COMPANY' ? 'Company Owner' : 'Driver / Truck Owner'}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {hasTargetProfile && !showCreateForm ? (
          <div className="text-center space-y-4 py-3">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
              {targetRole === 'COMPANY' ? <Building2 className="w-8 h-8" /> : <Truck className="w-8 h-8" />}
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-navy-900">Switch Active Operations Portal</h4>
              <p className="text-sm text-slate-500 mt-1">
                You already have a verified {targetRole === 'COMPANY' ? 'Company Owner' : 'Driver'} profile linked to your account.
              </p>
            </div>

            <div className="pt-4 flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" loading={loading} onClick={handleDirectSwitch} icon={ArrowRightLeft}>
                Switch to {targetRole === 'COMPANY' ? 'Company' : 'Driver'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium leading-relaxed flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">You don't have a {targetRole === 'COMPANY' ? 'Company Owner' : 'Driver'} profile yet.</p>
                <p className="mt-0.5">Please fill out the basic profile setup below to activate your dual-role operations account.</p>
              </div>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-4">
              {targetRole === 'COMPANY' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Business Type</label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="Manufacturer">Manufacturer</option>
                        <option value="Distributor">Distributor</option>
                        <option value="Retailer">Retailer</option>
                        <option value="Wholesaler">Wholesaler</option>
                        <option value="E-commerce">E-commerce</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">City</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                      >
                        {GUJARAT_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Truck Number</label>
                    <input
                      type="text"
                      required
                      value={formData.truckNumber}
                      onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Truck Type</label>
                      <select
                        value={formData.truckType}
                        onChange={(e) => setFormData({ ...formData, truckType: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="Medium Truck">Medium Truck</option>
                        <option value="Heavy Truck">Heavy Truck</option>
                        <option value="Light Commercial Vehicle">LCV</option>
                        <option value="Trailer">Trailer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">Capacity (Tons)</label>
                      <input
                        type="number"
                        required
                        value={formData.capacityTons}
                        onChange={(e) => setFormData({ ...formData, capacityTons: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={loading} icon={Plus}>
                  Create {targetRole === 'COMPANY' ? 'Company' : 'Driver'} Profile
                </Button>
              </div>
            </form>
          </div>
        )}

      </div>
    </Modal>
  );
};

export default RoleSwitchModal;
