import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, MapPin, Zap } from 'lucide-react';
import { fadeIn, slideUp } from '../../utils/animations';

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-navy-950 text-white py-20">
      
      {/* Background Highway Truck Image with Dark Overlay */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity">
        <img
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2000&q=80"
          alt="TruckLink Freight Truck Highway"
          className="w-full h-full object-cover object-center scale-105 transform transition-transform duration-10000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-transparent to-navy-950"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Trust Pill */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold text-brand-300"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Drivers • Flexible Fleet • Transparent Booking</span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="space-y-4 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans leading-[1.1]">
            Move Goods. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-amber-300 bg-clip-text text-transparent">
              Move Business.
            </span>
          </h1>
          <p className="text-lg sm:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            TruckLink connects businesses with reliable trucks and drivers for faster, simpler and smarter freight transportation in Gujarat & India.
          </p>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            to="/auth"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base rounded-2xl shadow-brand hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            <span>Book a Demo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-2xl backdrop-blur-md border border-white/20 transition-all"
          >
            Explore Services
          </a>
        </motion.div>

        {/* Floating Route Animation Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="pt-12 max-w-lg mx-auto"
        >
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Surat Textile Hub</span>
            </div>

            {/* Moving Line */}
            <div className="flex-1 mx-4 relative h-0.5 bg-slate-700 overflow-hidden rounded-full">
              <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-brand-500 to-amber-400 animate-pulse"></div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>Mumbai Port Hub</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
