import ServiceLocation from '../models/ServiceLocation.js';

// @desc    Get All Service Locations (Gujarat & India)
// @route   GET /api/service-locations
// @access  Public
export const getLocations = async (req, res) => {
  try {
    const { region, search } = req.query;
    let filter = {};

    if (region) {
      filter.region = region;
    }

    if (search) {
      filter.$or = [
        { cityName: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    const locations = await ServiceLocation.find(filter).sort({ cityName: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
