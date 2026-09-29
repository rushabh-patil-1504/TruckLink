import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Send, CheckCircle2, ShieldAlert, Route, BellRing, Flag } from 'lucide-react';

const companySteps = [
  { step: '01', icon: UserPlus, title: 'Create Company Account', desc: 'Sign up as a business owner or manufacturer to start booking trucks.' },
  { step: '02', icon: Search, title: 'Discover Available Drivers', desc: 'Browse available drivers by route, city, capacity, and ratings.' },
  { step: '03', icon: Send, title: 'Submit Booking Request', desc: 'Enter shipment details and submit request with estimated pricing.' },
  { step: '04', icon: CheckCircle2, title: 'Track Checkpoints & Pay', desc: 'Monitor manual delivery checkpoints live and make demo payment.' }
];

const driverSteps = [
  { step: '01', icon: UserPlus, title: 'Create Driver/Truck Profile', desc: 'Register vehicle details, capacity (Tons), and base city.' },
  { step: '02', icon: Route, title: 'Set Fleet Availability', desc: 'Announce your trip dates, origin, destination, and available tonnage.' },
  { step: '03', icon: BellRing, title: 'Receive Booking Requests', desc: 'Get real-time notification requests from companies and accept.' },
  { step: '04', icon: Flag, title: 'Post Delivery Checkpoints', desc: 'Update manual transit milestones from start to final destination.' }
];

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('COMPANY');

  const steps = activeTab === 'COMPANY' ? companySteps : driverSteps;

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <span className="px-3.5 py-1.5 rounded-full bg-navy-100 text-navy-800 text-xs font-extrabold uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-navy-900 font-sans">
            How TruckLink Works
          </h2>
          <p className="text-slate-600 font-medium text-base">
            Designed for seamless operation whether you need to move goods or maximize truck utilization.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="p-1.5 bg-slate-100 rounded-2xl inline-flex gap-2 border border-slate-200">
            <button
              onClick={() => setActiveTab('COMPANY')}
              className={`px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                activeTab === 'COMPANY'
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              For Companies / Businesses
            </button>
            <button
              onClick={() => setActiveTab('DRIVER')}
              className={`px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                activeTab === 'DRIVER'
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              For Truck Drivers / Owners
            </button>
          </div>
        </div>

        {/* Horizontal Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200 relative group hover:border-brand-400 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-brand-500/80 font-mono">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-navy-900 group-hover:bg-brand-500 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h4 className="text-lg font-extrabold text-navy-900 font-sans mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
