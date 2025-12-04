import { ref } from 'vue';



/**
 * Options pour la configuration de la modale.
 */
export interface OptionsModale {
  titre: string;
  message?: string;
  type?: 'confirm' | 'prompt';
  placeholder?: string;
  texteConfirmation?: string;
  texteAnnulation?: string;
}

/**
 * Composable pour gérer l'affichage d'une modale.
 */
export const utiliserModal = () => {
  const modaleVisible = ref(false);
  const optionsModale = ref<OptionsModale>({
    titre: '',
    type: 'confirm'
  });

  let resoudrePromesse: ((valeur: string | boolean) => void) | null = null;

  /**
   * Affiche la modale avec les options spécifiées.
   * @param options Les options de la modale.
   * @returns Une promesse résolue avec la valeur saisie ou la confirmation.
   */
  const afficherModale = (options: OptionsModale): Promise<string | boolean> => {
    optionsModale.value = options;
    modaleVisible.value = true;

    return new Promise((resolve) => {
      resoudrePromesse = resolve;
    });
  };

  /**
   * Gère la confirmation de la modale.
   * @param valeur La valeur saisie (optionnel).
   */
  const gererConfirmation = (valeur?: string) => {
    if (resoudrePromesse) {
      if (optionsModale.value.type === 'prompt') {
        let val = '';
        if (valeur) {
          val = valeur;
        }
        resoudrePromesse(val);
      } else {
        resoudrePromesse(true);
      }
      resoudrePromesse = null;
    }
    modaleVisible.value = false;
  };

  /**
   * Gère l'annulation de la modale.
   */
  const gererAnnulation = () => {
    if (resoudrePromesse) {
      if (optionsModale.value.type === 'prompt') {
        resoudrePromesse('');
      } else {
        resoudrePromesse(false);
      }
      resoudrePromesse = null;
    }
    modaleVisible.value = false;
  };

  return {
    modaleVisible,
    optionsModale,
    afficherModale,
    gererConfirmation,
    gererAnnulation
  };
};

