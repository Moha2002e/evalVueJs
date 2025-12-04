<script setup lang="ts">
import { ref, onMounted } from 'vue';

/**
 * Options pour l'affichage d'un toast.
 */
export interface OptionsToast {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

const props = withDefaults(defineProps<OptionsToast>(), {
  type: 'info',
  duration: 3000
});

const estVisible = ref(false);
const emit = defineEmits<{
  (e: 'close'): void;
}>();

onMounted(() => {
  estVisible.value = true;
  setTimeout(() => {
    fermer();
  }, props.duration);
});

/**
 * Ferme le toast avec une animation.
 */
const fermer = () => {
  estVisible.value = false;
  setTimeout(() => {
    emit('close');
  }, 300); // Attendre la fin de l'animation
};

/**
 * Récupère l'icône correspondant au type de toast.
 */
const obtenirIcone = () => {
  switch (props.type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    default:
      return 'ℹ';
  }
};
</script>

<template>
  <Transition name="toast">
    <div v-if="estVisible" :class="['toast', `toast-${type}`]" @click="fermer">
      <div class="toast-icon">{{ obtenirIcone() }}</div>
      <div class="toast-message">{{ message }}</div>
      <button class="toast-close" @click.stop="fermer">×</button>
    </div>
  </Transition>
</template>

<style scoped src="../styles/Toast.css"></style>
