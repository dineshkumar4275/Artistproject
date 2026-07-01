import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Default toast configuration
export const defaultToastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

// Custom toast functions
export const showToast = {
  // Success toast
  success: (message, options = {}) => {
    toast.success(message, { ...defaultToastConfig, ...options });
  },
  
  // Error toast
  error: (message, options = {}) => {
    toast.error(message, { ...defaultToastConfig, ...options });
  },
  
  // Warning toast
  warning: (message, options = {}) => {
    toast.warning(message, { ...defaultToastConfig, ...options });
  },
  
  // Info toast
  info: (message, options = {}) => {
    toast.info(message, { ...defaultToastConfig, ...options });
  },
  
  // Custom confirm toast
  confirm: (message, onConfirm, onCancel, options = {}) => {
    const confirmConfig = {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      className: 'toast-confirm-container',
      ...options
    };
    
    toast.warn(
      <div className="toast-confirm">
        <p>{message}</p>
        <div className="toast-buttons">
          <button className="toast-confirm-btn" onClick={() => {
            if (onConfirm) onConfirm();
            toast.dismiss();
          }}>
            Yes, Confirm
          </button>
          <button className="toast-cancel-btn" onClick={() => {
            if (onCancel) onCancel();
            toast.dismiss();
          }}>
            Cancel
          </button>
        </div>
      </div>,
      confirmConfig
    );
  },
  
  // Danger confirm with custom buttons
  dangerConfirm: (message, onConfirm, onCancel, options = {}) => {
    const confirmConfig = {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      className: 'toast-confirm-container',
      ...options
    };
    
    toast.error(
      <div className="toast-confirm">
        <p>⚠️ {message}</p>
        <p className="toast-warning-text">This action cannot be undone!</p>
        <div className="toast-buttons">
          <button className="toast-confirm-btn" onClick={() => {
            if (onConfirm) onConfirm();
            toast.dismiss();
          }}>
            Yes, Delete
          </button>
          <button className="toast-cancel-btn" onClick={() => {
            if (onCancel) onCancel();
            toast.dismiss();
          }}>
            Cancel
          </button>
        </div>
      </div>,
      confirmConfig
    );
  },
  
  // Loading toast (doesn't auto dismiss)
  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...defaultToastConfig,
      autoClose: false,
      ...options
    });
  },
  
  // Dismiss all toasts
  dismiss: () => {
    toast.dismiss();
  },
  
  // Dismiss specific toast
  dismissById: (id) => {
    toast.dismiss(id);
  }
};