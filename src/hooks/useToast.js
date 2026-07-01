import { showToast } from '../utils/toastConfig';

function useToast() {
  return {
    success: showToast.success,
    error: showToast.error,
    warning: showToast.warning,
    info: showToast.info,
    confirm: showToast.confirm,
    dangerConfirm: showToast.dangerConfirm,
    loading: showToast.loading,
    dismiss: showToast.dismiss,
    dismissById: showToast.dismissById,
  };
}

export default useToast;