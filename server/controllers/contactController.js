import ContactMessage from '../models/ContactMessage.js';

// @desc    Submit Public Contact / Demo Request Form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Query',
      message
    });

    res.status(201).json({
      message: 'Thank you! Your message has been sent. A TruckLink representative will get back to you shortly.',
      contactMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
