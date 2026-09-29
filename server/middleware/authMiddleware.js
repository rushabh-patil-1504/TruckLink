import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'trucklink_super_secret_jwt_key_2026_prod', {
    expiresIn: '30d'
  });
};

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'trucklink_super_secret_jwt_key_2026_prod');

      req.user = await User.findById(decoded.id)
        .select('-password')
        .populate('driverProfile')
        .populate('companyProfile');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware Error]', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.activeRole || req.user.role;
    if (!roles.includes(userRole) && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: `Role (${userRole}) is not authorized to access this resource`
      });
    }
    next();
  };
};
