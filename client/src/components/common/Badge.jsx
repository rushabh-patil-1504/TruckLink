import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

const Badge = ({ status, text, className = '' }) => {
  const displayStatus = status || text || 'AVAILABLE';
  const colorStyle = STATUS_COLORS[displayStatus] || 'bg-slate-100 text-slate-700 border-slate-300';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${colorStyle} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {text || displayStatus.replace('_', ' ')}
    </span>
  );
};

export default Badge;
