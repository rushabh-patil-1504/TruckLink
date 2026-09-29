import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from '../config/db.js';
import User from '../models/User.js';
import DriverProfile from '../models/DriverProfile.js';
import CompanyProfile from '../models/CompanyProfile.js';
import Truck from '../models/Truck.js';
import ServiceLocation from '../models/ServiceLocation.js';
import Availability from '../models/Availability.js';
import Booking from '../models/Booking.js';
import Delivery from '../models/Delivery.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';
import ContactMessage from '../models/ContactMessage.js';

import { serviceLocationsData, demoDriversData, demoCompaniesData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  try {
    console.log('[Seed Script] Initializing Database Connection...');
    await connectDB();

    console.log('[Seed Script] Clearing existing database collections...');
    await User.deleteMany({});
    await DriverProfile.deleteMany({});
    await CompanyProfile.deleteMany({});
    await Truck.deleteMany({});
    await ServiceLocation.deleteMany({});
    await Availability.deleteMany({});
    await Booking.deleteMany({});
    await Delivery.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    await Payment.deleteMany({});
    await ContactMessage.deleteMany({});

    console.log('[Seed Script] Seeding Service Locations (Gujarat & India)...');
    await ServiceLocation.insertMany(serviceLocationsData);

    console.log('[Seed Script] Seeding Driver Accounts & Trucks...');
    const createdDrivers = [];

    for (const d of demoDriversData) {
      const user = await User.create({
        name: d.name,
        email: d.email,
        mobile: d.mobile,
        password: 'password123',
        role: 'DRIVER',
        activeRole: 'DRIVER'
      });

      const truck = await Truck.create({
        driver: user._id,
        truckNumber: d.truckNumber,
        registrationNumber: d.registrationNumber,
        truckType: d.truckType,
        capacityTons: d.capacityTons
      });

      const driverProfile = await DriverProfile.create({
        user: user._id,
        truck: truck._id,
        experienceYears: d.experienceYears,
        baseCity: d.baseCity,
        preferredRoutes: d.preferredRoutes,
        materialTypesAccepted: d.materialTypesAccepted,
        availabilityStatus: d.availabilityStatus,
        currentRoute: {
          origin: d.originCity,
          destination: d.destinationCity,
          availableFrom: new Date(),
          availableUntil: new Date(Date.now() + 86400000 * 4),
          maxWeightTons: d.maxWeightTons,
          materialType: d.materialType,
          truckType: d.truckType,
          notes: 'Available for immediate dispatch'
        },
        rating: d.rating,
        totalReviews: d.totalReviews,
        completedDeliveries: d.completedDeliveries
      });

      user.driverProfile = driverProfile._id;
      await user.save();

      await Availability.create({
        driver: user._id,
        driverProfile: driverProfile._id,
        truck: truck._id,
        originCity: d.originCity,
        destinationCity: d.destinationCity,
        availableFrom: new Date(),
        availableUntil: new Date(Date.now() + 86400000 * 4),
        materialTypes: [d.materialType],
        maxWeightTons: d.maxWeightTons,
        truckType: d.truckType,
        notes: 'Ready for quick loading',
        isActive: true
      });

      createdDrivers.push({ user, driverProfile, truck });
    }

    console.log('[Seed Script] Seeding Company Owner Accounts...');
    const createdCompanies = [];

    for (const c of demoCompaniesData) {
      const user = await User.create({
        name: c.name,
        email: c.email,
        mobile: c.mobile,
        password: 'password123',
        role: 'COMPANY',
        activeRole: 'COMPANY'
      });

      const companyProfile = await CompanyProfile.create({
        user: user._id,
        companyName: c.companyName,
        contactPerson: c.contactPerson,
        businessType: c.businessType,
        gstNumber: c.gstNumber,
        companyAddress: c.companyAddress,
        city: c.city,
        state: c.state,
        totalBookings: 5,
        completedShipments: 4
      });

      user.companyProfile = companyProfile._id;
      await user.save();

      createdCompanies.push({ user, companyProfile });
    }

    console.log('[Seed Script] Creating Sample Bookings & Delivery Checkpoints...');

    const d1 = createdDrivers[0];
    const c1 = createdCompanies[0];

    const booking1 = await Booking.create({
      bookingNumber: 'TL-2026-9011',
      company: c1.user._id,
      companyProfile: c1.companyProfile._id,
      driver: d1.user._id,
      driverProfile: d1.driverProfile._id,
      truck: d1.truck._id,
      pickupLocation: 'Surat',
      destinationLocation: 'Mumbai',
      pickupDate: new Date(Date.now() - 86400000),
      expectedDeliveryDate: new Date(Date.now() + 86400000),
      materialType: 'Textiles / Cotton Bales',
      weightTons: 15,
      truckType: 'Medium Truck',
      price: 18500,
      specialInstructions: 'Handle with care - keep dry',
      status: 'ACTIVE',
      paymentStatus: 'PENDING'
    });

    await Delivery.create({
      booking: booking1._id,
      driver: d1.user._id,
      company: c1.user._id,
      status: 'IN_TRANSIT',
      currentLocation: 'Vadodara',
      startTime: new Date(Date.now() - 86400000),
      checkpoints: [
        { cityName: 'Surat', timestamp: new Date(Date.now() - 86400000), note: 'Loaded at Textile Hub, Surat', isCompleted: true },
        { cityName: 'Bharuch', timestamp: new Date(Date.now() - 43200000), note: 'Crossed Narmada Bridge - Highway smooth', isCompleted: true },
        { cityName: 'Vadodara', timestamp: new Date(Date.now() - 10800000), note: 'Reached Vadodara Toll Plaza - Halting for rest', isCompleted: true }
      ]
    });

    const d2 = createdDrivers[1];
    const c2 = createdCompanies[1];

    const booking2 = await Booking.create({
      bookingNumber: 'TL-2026-8802',
      company: c2.user._id,
      companyProfile: c2.companyProfile._id,
      driver: d2.user._id,
      driverProfile: d2.driverProfile._id,
      truck: d2.truck._id,
      pickupLocation: 'Ahmedabad',
      destinationLocation: 'Vadodara',
      pickupDate: new Date(Date.now() - 86400000 * 3),
      expectedDeliveryDate: new Date(Date.now() - 86400000 * 2),
      materialType: 'Industrial Valves',
      weightTons: 20,
      truckType: 'Heavy Truck',
      price: 14200,
      status: 'COMPLETED',
      paymentStatus: 'SUCCESS'
    });

    const payment2 = await Payment.create({
      booking: booking2._id,
      company: c2.user._id,
      amount: 14200,
      paymentMethod: 'DEMO_CARD',
      transactionId: 'TXN-DEMO-88991122',
      status: 'SUCCESS'
    });

    const review2 = await Review.create({
      booking: booking2._id,
      company: c2.user._id,
      companyName: c2.companyProfile.companyName,
      driver: d2.user._id,
      driverProfile: d2.driverProfile._id,
      rating: 5.0,
      comment: 'Excellent driver! Vehicle was in top condition and delivered heavy industrial equipment on schedule.',
      deliveryRoute: 'Ahmedabad → Vadodara'
    });

    booking2.payment = payment2._id;
    booking2.review = review2._id;
    await booking2.save();

    console.log('[Seed Script] Creating Notifications & Contact Queries...');
    await Notification.create({
      recipient: c1.user._id,
      title: 'Checkpoint Milestone Updated 📍',
      message: 'Driver Rahul Patel reached checkpoint Vadodara.',
      type: 'CHECKPOINT',
      link: '/company/deliveries'
    });

    await ContactMessage.create({
      name: 'Hardik Shah',
      email: 'hardik@textilemill.com',
      phone: '9825012345',
      subject: 'Fleet Partnership Inquiry',
      message: 'We ship 200+ tons of yarn monthly from Surat to Bhiwandi. Looking for long-term contract pricing.'
    });

    console.log('\n==================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    console.log(`- Service Locations: ${serviceLocationsData.length}`);
    console.log(`- Demo Drivers: ${createdDrivers.length}`);
    console.log(`- Demo Companies: ${createdCompanies.length}`);
    console.log(`\nDemo Credentials:`);
    console.log(`Driver Login:   email: rahul.driver@trucklink.com | password: password123`);
    console.log(`Company Login:  email: contact@abctextiles.com  | password: password123`);
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDB();
