import { ref } from 'vue';
import type { OptionsToast } from '../components/Toast.vue';

const refConteneurToast = ref<{ afficherToast: (options: OptionsToast) => void } | null>(null);

/**
 * Composable pour gérer l'affichage de toasts.
 */
export const utiliserToast = () => {
  /**
   * Affiche un toast.
   * @param options Les options du toast.
   */
  const afficherToast = (options: OptionsToast) => {
    if (refConteneurToast.value) {
      refConteneurToast.value.afficherToast(options);
    } else {
      // Fallback vers alert si le toast n'est pas encore monté
      alert(options.message);
    }
  };

  return {
    afficherToast,
    refConteneurToast
  };
};

