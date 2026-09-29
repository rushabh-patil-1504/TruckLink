import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CalendarCheck, MapPin, ClipboardList, Eye, Star, Cpu } from 'lucide-react';
import { staggerContainer, slideUp } from '../../utils/animations';

const services = [
  {
    icon: Truck,
    title: '1. On-Demand Truck Booking',
    description: 'Businesses can easily find, evaluate, and request suitable trucks tailored to cargo weight and material type.'
  },
  {
    icon: CalendarCheck,
    title: '2. Driver & Fleet Availability',
    description: 'Drivers announce their availability, preferred return routes, and dates for optimal backhaul capacity utilization.'
  },
  {
    icon: MapPin,
    title: '3. Route & Milestone Management',
    description: 'Drivers manually log transit checkpoints (e.g. Surat ✓ -> Vadodara ✓ -> Mumbai ✓) for end-to-end status visibility.'
  },
  {
    icon: ClipboardList,
    title: '4. Booking Management',
    description: 'Centralized operations hub for businesses and drivers to oversee pending, active, and completed freight orders.'
  },
  {
    icon: Eye,
    title: '5. Delivery Visibility',
    description: 'Real-time synchronization ensures companies see every manual milestone checkpoint update instantly.'
  },
  {
    icon: Star,
    title: '6. Reviews & Ratings System',
    description: 'Companies rate drivers post-delivery, generating authentic average rating scores saved directly to MongoDB.'
  },
  {
    icon: Cpu,
    title: '7. Digital Freight Platform',
    description: 'Eliminates tedious manual phone coordination through unified role-based dashboards and automated alerts.'
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold uppercase tracking-wider">
            Smart Logistics Solutions
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-navy-900 font-sans">
            What TruckLink Offers
          </h2>
          <p className="text-slate-600 font-medium text-base sm:text-lg">
            Empowering businesses and truck owners with modern tools to manage goods transportation seamlessly.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={slideUp}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-brand-300 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-brand-500 text-navy-900 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                    <Icon className="w-7 h-7 stroke-[2]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-navy-900 font-sans group-hover:text-brand-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesSection;
