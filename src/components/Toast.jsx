import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon-success" />,
    info: <Info size={18} className="toast-icon-info" />,
    warning: <AlertTriangle size={18} className="toast-icon-warning" />
  };

  return (
    <div className={`toast-container toast-${toast.type || 'info'}`}>
      <div className="toast-content">
        {icons[toast.type] || icons.info}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss toast">
        <X size={16} />
      </button>
    </div>
  );
}
