<script setup lang="ts">
/**
 * Props pour le composant LoadingSpinner.
 */
defineProps<{
  taille?: 'petit' | 'moyen' | 'grand';
  message?: string;
}>();

const classesTaille = {
  petit: 'spinner-small',
  moyen: 'spinner-medium',
  grand: 'spinner-large'
};
</script>

<template>
  <div class="loading-container">
    <div :class="['spinner', classesTaille[taille || 'moyen']]">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<style scoped src="../styles/LoadingSpinner.css"></style>

