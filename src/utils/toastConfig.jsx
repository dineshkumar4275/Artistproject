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
  
  // Loading toast
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

export default showToast;