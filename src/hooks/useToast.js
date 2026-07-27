import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function useToast() {
  const defaultConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  return {
    success: (message, options = {}) => {
      toast.success(message, { ...defaultConfig, ...options });
    },
    error: (message, options = {}) => {
      toast.error(message, { ...defaultConfig, ...options });
    },
    warning: (message, options = {}) => {
      toast.warning(message, { ...defaultConfig, ...options });
    },
    info: (message, options = {}) => {
      toast.info(message, { ...defaultConfig, ...options });
    },
    loading: (message, options = {}) => {
      return toast.loading(message, { ...defaultConfig, autoClose: false, ...options });
    },
    dismiss: () => {
      toast.dismiss();
    },
    dismissById: (id) => {
      toast.dismiss(id);
    }
  };
}

export default useToast;