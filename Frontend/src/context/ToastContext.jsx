import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './ToastContext.css';

export const ToastContext = createContext();

let idCounter = 0;

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    // Allow exit animation to play before removing from DOM.
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type, leaving: false }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (msg, d) => addToast(msg, 'success', d),
    error: (msg, d) => addToast(msg, 'error', d),
    info: (msg, d) => addToast(msg, 'info', d),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-viewport" role="region" aria-live="polite">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <div
              key={t.id}
              className={`toast toast-${t.type} ${t.leaving ? 'toast-leaving' : ''}`}
            >
              <Icon size={20} className="toast-icon" />
              <span className="toast-message">{t.message}</span>
              <button
                className="toast-close"
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
              <span className="toast-progress" />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Safe no-op fallback so components never crash if provider is missing.
    return { success: () => {}, error: () => {}, info: () => {} };
  }
  return ctx;
};
