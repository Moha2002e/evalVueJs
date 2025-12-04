<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

/**
 * Props pour le composant Modal.
 */
export interface PropsModale {
  titre: string;
  message?: string;
  type?: 'confirm' | 'prompt';
  placeholder?: string;
  texteConfirmation?: string;
  texteAnnulation?: string;
  visible: boolean;
}

const props = withDefaults(defineProps<PropsModale>(), {
  type: 'confirm',
  texteConfirmation: 'Confirmer',
  texteAnnulation: 'Annuler',
  placeholder: ''
});

const emit = defineEmits<{
  (e: 'confirm', valeur?: string): void;
  (e: 'cancel'): void;
  (e: 'update:visible', valeur: boolean): void;
}>();

const valeurSaisie = ref('');
const estVisible = ref(false);

watch(() => props.visible, (nouvelleValeur) => {
  if (nouvelleValeur) {
    estVisible.value = true;
    valeurSaisie.value = '';
    // Focus sur l'input si c'est un prompt
    if (props.type === 'prompt') {
      setTimeout(() => {
        const input = document.querySelector('.modal-input') as HTMLInputElement;
        if (input) input.focus();
      }, 100);
    }
  }
});

const gererConfirmation = () => {
  if (props.type === 'prompt') {
    emit('confirm', valeurSaisie.value);
  } else {
    emit('confirm');
  }
  fermer();
};

const gererAnnulation = () => {
  emit('cancel');
  fermer();
};

const fermer = () => {
  estVisible.value = false;
  setTimeout(() => {
    emit('update:visible', false);
  }, 300);
};

const gererTouche = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    gererAnnulation();
  } else if (e.key === 'Enter' && props.type === 'prompt' && valeurSaisie.value.trim()) {
    gererConfirmation();
  }
};

onMounted(() => {
  document.addEventListener('keydown', gererTouche);
});

onUnmounted(() => {
  document.removeEventListener('keydown', gererTouche);
});
</script>

<template>
  <Transition name="modal">
    <div v-if="estVisible" class="modal-overlay" @click.self="gererAnnulation">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ titre }}</h3>
        </div>
        
        <div class="modal-body">
          <p v-if="message" class="modal-message">{{ message }}</p>
          
          <input
            v-if="type === 'prompt'"
            v-model="valeurSaisie"
            type="text"
            class="modal-input"
            :placeholder="placeholder"
            @keydown.enter="gererConfirmation"
          />
        </div>
        
        <div class="modal-footer">
          <button class="btn-cancel" @click="gererAnnulation">
            {{ texteAnnulation }}
          </button>
          <button 
            class="btn-confirm" 
            @click="gererConfirmation"
            :disabled="type === 'prompt' && !valeurSaisie.trim()"
          >
            {{ texteConfirmation }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped src="../styles/Modal.css"></style>

