import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useImages from '../hooks/useImages';
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

export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, { ...defaultToastConfig, ...options });
  },
  error: (message, options = {}) => {
    toast.error(message, { ...defaultToastConfig, ...options });
  },
  warning: (message, options = {}) => {
    toast.warning(message, { ...defaultToastConfig, ...options });
  },
  info: (message, options = {}) => {
    toast.info(message, { ...defaultToastConfig, ...options });
  },
  loading: (message, options = {}) => {
    return toast.loading(message, { ...defaultToastConfig, autoClose: false, ...options });
  },
  dismiss: () => {
    toast.dismiss();
  },
  dismissById: (id) => {
    toast.dismiss(id);
  }
};

// Default export to fix Vercel build
export default showToast;