<script setup lang="ts">
import { ref, watch } from 'vue';
import { PatientDAO } from '../dao/PatientDAO';
import type { Patient } from '../models';

const props = defineProps<{
  patient: Patient | null;
}>();

const emit = defineEmits<{
  (e: 'logged', patient: Patient): void;
}>();

const nom = ref('');
const prenom = ref('');
const dateNaissance = ref('');
const numeroPatient = ref<number | null>(null);
const nouveauPatient = ref(false);
const erreur = ref('');
const chargement = ref(false);

const patientDAO = new PatientDAO();

// Reset form when patient logs out
watch(() => props.patient, (newVal) => {
  if (!newVal) {
    nom.value = '';
    prenom.value = '';
    dateNaissance.value = '';
    numeroPatient.value = null;
    nouveauPatient.value = false;
  }
});

const gererConnexion = async () => {
  erreur.value = '';
  chargement.value = true;
  try {
    const p = await patientDAO.connecterPatient(
      nom.value, 
      prenom.value, 
      dateNaissance.value,
      numeroPatient.value, 
      nouveauPatient.value
    );
    emit('logged', p);
  } catch (e: any) {
    console.error(e);
    erreur.value = e.message || 'Erreur de connexion';
  } finally {
    chargement.value = false;
  }
};
</script>

<template>
  <div class="login-card">
    <div v-if="patient" class="patient-info">
      <h2>Patient Connecté</h2>
      <div class="info-row">
        <strong>Nom :</strong> {{ patient.nom }}
      </div>
      <div class="info-row">
        <strong>Prénom :</strong> {{ patient.prenom }}
      </div>
      <div class="info-row">
        <strong>Numéro Patient :</strong> {{ patient.id }}
      </div>
    </div>

    <div v-else>
      <h2>Identification Patient</h2>
      <form @submit.prevent="gererConnexion" class="login-form">
        <div class="form-group">
          <label for="nom">Nom</label>
          <input id="nom" v-model="nom" type="text" required />
        </div>

        <div class="form-group">
          <label for="prenom">Prénom</label>
          <input id="prenom" v-model="prenom" type="text" required />
        </div>

        <div class="form-group">
          <label for="dateNaissance">Date de naissance</label>
          <input id="dateNaissance" v-model="dateNaissance" type="date" required />
        </div>

        <div class="form-group" v-if="!nouveauPatient">
          <label for="numeroPatient">Numéro Patient</label>
          <input id="numeroPatient" v-model="numeroPatient" type="number" required />
        </div>

        <div class="form-checkbox">
          <input type="checkbox" id="nouveau" v-model="nouveauPatient" />
          <label for="nouveau">Nouveau patient</label>
        </div>

        <button type="submit" :disabled="chargement">
          Login
        </button>

        <div v-if="erreur" class="error-message">
          {{ erreur }}
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped src="../styles/LoginPatient.css"></style>
