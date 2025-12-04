<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Toast, { type OptionsToast } from './Toast.vue';
import { utiliserToast } from '../composables/useToast';

interface ElementToast extends OptionsToast {
  id: number;
}

const listeToasts = ref<ElementToast[]>([]);
let idToast = 0;

const afficherToast = (options: OptionsToast) => {
  const id = idToast++;
  listeToasts.value.push({ ...options, id });
};

const supprimerToast = (id: number) => {
  const index = listeToasts.value.findIndex(t => t.id === id);
  if (index > -1) {
    listeToasts.value.splice(index, 1);
  }
};

// Enregistrer la référence pour utiliserToast
const { refConteneurToast } = utiliserToast();

onMounted(() => {
  refConteneurToast.value = { afficherToast };
});
</script>

<template>
  <div class="toast-container">
    <Toast
      v-for="toast in listeToasts"
      :key="toast.id"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      @close="supprimerToast(toast.id)"
    />
  </div>
</template>

<style scoped src="../styles/ToastContainer.css"></style>

