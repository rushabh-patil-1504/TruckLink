import React from 'react';
import { Building2, Mail, Phone, MapPin, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CompanyHeader from '../../components/company/CompanyHeader';
import { useAuth } from '../../context/AuthContext';

const CompanyProfile = () => {
  const { user } = useAuth();
  const companyProfile = user?.companyProfile || {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <CompanyHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8 w-full">
        
        {/* Header Box */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-navy-900 text-white font-black text-2xl flex items-center justify-center">
            {companyProfile.companyName?.charAt(0) || user?.name?.charAt(0)}
          </div>
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Registered Commercial Client</span>
            <h2 className="text-2xl font-extrabold text-navy-900 font-sans mt-0.5">
              {companyProfile.companyName || `${user?.name}'s Business`}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Contact Person: {companyProfile.contactPerson || user?.name} • Base: {companyProfile.city || 'Surat'}, {companyProfile.state || 'Gujarat'}
            </p>
          </div>
        </div>

        {/* Company Details */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-6">
          <h3 className="text-lg font-extrabold text-navy-900 font-sans flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-500" />
            <span>Business Entity Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-medium text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Business Category</span>
              <span className="text-sm font-extrabold text-navy-900">{companyProfile.businessType || 'Manufacturer'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">GST Number</span>
              <span className="text-sm font-extrabold text-navy-900 font-mono">{companyProfile.gstNumber || '24AAAAA0000A1Z5'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Registered Mobile</span>
              <span className="text-sm font-extrabold text-navy-900">{user?.mobile}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Official Email</span>
              <span className="text-sm font-extrabold text-navy-900">{user?.email}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 sm:col-span-2">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Factory / Business Address</span>
              <span className="text-sm font-bold text-navy-900">{companyProfile.companyAddress || 'Ring Road Industrial Market'}, {companyProfile.city}, {companyProfile.state}</span>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default CompanyProfile;
