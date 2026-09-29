export const API_BASE_URL = 'http://localhost:5000/api';

export const TRUCK_TYPES = [
  'Mini Truck',
  'Light Commercial Vehicle',
  'Medium Truck',
  'Heavy Truck',
  'Trailer',
  'Other'
];

export const MATERIAL_TYPES = [
  'Textiles & Garments',
  'Industrial Machinery',
  'Ceramic Tiles & Sanitaryware',
  'Petrochemicals & Plastics',
  'FMCG & Consumer Goods',
  'Agricultural Produce',
  'Steel & Metal Rods',
  'Pharmaceuticals',
  'General Freight / Cargo'
];

export const GUJARAT_CITIES = [
  'Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Gandhinagar',
  'Bhavnagar', 'Jamnagar', 'Junagadh', 'Anand', 'Bharuch',
  'Vapi', 'Valsad', 'Mehsana', 'Morbi', 'Navsari',
  'Nadiad', 'Palanpur', 'Porbandar', 'Gandhidham', 'Bhuj'
];

export const INDIA_MAJOR_CITIES = [
  ...GUJARAT_CITIES,
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'
];

export const STATUS_COLORS = {
  AVAILABLE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  BUSY: 'bg-amber-100 text-amber-800 border-amber-300',
  OFFLINE: 'bg-slate-100 text-slate-700 border-slate-300',
  
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  ACCEPTED: 'bg-blue-50 text-blue-700 border-blue-200',
  CONFIRMED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse-slow',
  COMPLETED: 'bg-slate-100 text-slate-800 border-slate-300',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',

  SUCCESS: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PROCESSING: 'bg-amber-100 text-amber-800 border-amber-200',
  FAILED: 'bg-rose-100 text-rose-800 border-rose-200'
};
