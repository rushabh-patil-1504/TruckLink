import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Mail, Phone, MapPin, Shield, Clock, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Callout Card */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-3xl p-8 sm:p-10 mb-16 shadow-brand text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-sans">Ready to Streamline Your Freight Logistics?</h3>
            <p className="text-brand-100 font-medium text-sm sm:text-base">
              Connect with verified drivers or list your truck availability in real-time across Gujarat and India.
            </p>
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-navy-900 font-extrabold rounded-2xl shadow-lg hover:bg-slate-100 transition-all shrink-0 transform hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 text-brand-600" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
                Truck<span className="text-brand-500">Link</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              TruckLink is a smart web-based freight logistics platform connecting truck owners with manufacturing and commercial businesses across Gujarat & India.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-emerald-400" /> Verified Drivers</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-brand-400" /> Live Checkpoints</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link to="/" className="hover:text-brand-400 transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-brand-400 transition-colors">Services</Link></li>
              <li><Link to="/places" className="hover:text-brand-400 transition-colors">Places We Serve</Link></li>
              <li><Link to="/reviews" className="hover:text-brand-400 transition-colors">Customer Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Key Locations */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Primary Hubs</h4>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li>Surat (Textile Hub)</li>
              <li>Ahmedabad (Commercial Hub)</li>
              <li>Vadodara (Industrial Hub)</li>
              <li>Morbi (Ceramic Hub)</li>
              <li>Mumbai (Port & Freight)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>support@trucklink.in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Ring Road Industrial Zone, Surat, Gujarat 395002</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TruckLink Logistics Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 rounded bg-navy-800 text-slate-400 border border-navy-700">
              PROTOTYPE DEMO PLATFORM
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
