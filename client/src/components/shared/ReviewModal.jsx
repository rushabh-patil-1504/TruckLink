import React, { useState } from 'react';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import API from '../../services/api';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('Excellent driver! Vehicle condition was top-notch and shipment arrived right on schedule.');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await API.post('/reviews', {
        bookingId: booking._id,
        rating,
        comment
      });
      onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Rate Driver: ${booking.driver?.name || 'Driver'}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmitReview} className="space-y-6">
        
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="text-center space-y-2">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">Overall Service Rating</label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1.5 focus:outline-none transition-transform transform hover:scale-125"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-amber-500 block">{rating} Out of 5 Stars</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">Driver Feedback Review</label>
          <textarea
            rows="3"
            required
            placeholder="Share feedback on loading speed, communication, vehicle state, etc."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
          ></textarea>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} icon={Send}>
            Submit Review
          </Button>
        </div>

      </form>
    </Modal>
  );
};

export default ReviewModal;
