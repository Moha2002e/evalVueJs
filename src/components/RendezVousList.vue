<script setup lang="ts">
import { ref, onMounted, watch, inject } from 'vue';
import { ConsultationDAO } from '../dao/ConsultationDAO';
import { MedecinDAO } from '../dao/MedecinDAO';
import { SpecialiteDAO } from '../dao/SpecialiteDAO';
import { utiliserToast } from '../composables/useToast';
import LoadingSpinner from './LoadingSpinner.vue';
import type { Consultation, Medecin, Specialite } from '../models';

const props = defineProps<{
  patientId: number;
}>();

const emit = defineEmits<{
  (e: 'logout'): void;
  (e: 'open-booking'): void;
}>();

const consultations = ref<Consultation[]>([]);
const medecins = ref<Medecin[]>([]);
const specialites = ref<Specialite[]>([]);
const chargement = ref(false);
const idSelectionne = ref<number | null>(null);

const consultationDAO = new ConsultationDAO();
const medecinDAO = new MedecinDAO();
const specialiteDAO = new SpecialiteDAO();
const { afficherToast } = utiliserToast();
const showModal = inject<(options: any) => Promise<any>>('showModal');

const chargerDonnees = async () => {
  chargement.value = true;
  try {
    console.log('🔍 Chargement des données pour le patient:', props.patientId);
    const [cons, meds, specs] = await Promise.all([
      props.patientId ? consultationDAO.obtenirParPatient(props.patientId) : Promise.resolve([]),
      medecinDAO.obtenirTout(),
      specialiteDAO.obtenirTout()
    ]);
    console.log('📋 Consultations reçues:', cons);
    console.log('👨‍⚕️ Médecins reçus:', meds);
    console.log('🏥 Spécialités reçues:', specs);
    consultations.value = cons;
    medecins.value = meds;
    specialites.value = specs;
  } catch (e) {
    console.error('❌ Erreur lors de la récupération des données', e);
  } finally {
    chargement.value = false;
  }
};

onMounted(chargerDonnees);
watch(() => props.patientId, chargerDonnees);

// Aides
const obtenirNomMedecin = (id: number) => {
  const m = medecins.value.find(med => med.id === id);
  if (m) {
    return m.nom + ' ' + m.prenom;
  } else {
    return 'Inconnu';
  }
};

const obtenirNomSpecialite = (idMedecin: number) => {
  const m = medecins.value.find(med => med.id === idMedecin);
  if (!m) return '-';
  const s = specialites.value.find(spec => spec.id === m.specialiteId);
  if (s) {
    return s.nom;
  } else {
    return '-';
  }
};

const formaterHeure = (consultation: Consultation) => {
  // L'API retourne date et hour séparés
  if (consultation.hour) {
    // Extraire seulement HH:MM de HH:MM:SS
    const partiesHeure = consultation.hour.split(':');
    return partiesHeure[0] + ':' + partiesHeure[1];
  }
  // Fallback si hour n'existe pas
  return new Date(consultation.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formaterDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

// Actions
const selectionnerLigne = (id: number) => {
  idSelectionne.value = id;
};

const gererSuppression = async () => {
  if (!idSelectionne.value) {
    afficherToast({ message: 'Veuillez sélectionner un rendez-vous', type: 'warning' });
    return;
  }
  
  if (showModal) {
    const confirme = await showModal({
      titre: 'Confirmer la suppression',
      message: 'Voulez-vous vraiment supprimer ce rendez-vous ?',
      type: 'confirm',
      texteConfirmation: 'Supprimer',
      texteAnnulation: 'Annuler'
    });
    
    if (confirme) {
      try {
        await consultationDAO.supprimer(idSelectionne.value);
        await chargerDonnees(); // Rafraîchir
        idSelectionne.value = null;
        afficherToast({ message: 'Rendez-vous supprimé avec succès', type: 'success' });
      } catch (e) {
        afficherToast({ message: 'Erreur lors de la suppression', type: 'error' });
        console.error(e);
      }
    }
  }
};
</script>

<template>
  <div class="rendez-vous-list">
    <h3>Mes Rendez-vous</h3>
    
    <LoadingSpinner v-if="chargement" message="Chargement des rendez-vous..." />
    
    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Médecin</th>
            <th>Spécialité</th>
            <th>Raison</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="c in consultations" 
            :key="c.id"
            :class="{ selected: idSelectionne === c.id }"
            @click="selectionnerLigne(c.id)"
          >
            <td>{{ formaterDate(c.date) }}</td>
            <td>{{ formaterHeure(c) }}</td>
            <td>{{ obtenirNomMedecin(c.doctor_id) }}</td>
            <td>{{ obtenirNomSpecialite(c.doctor_id) }}</td>
            <td>{{ c.reason }}</td>
          </tr>
          <tr v-if="consultations.length === 0">
            <td colspan="5" class="empty">Aucun rendez-vous prévu.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="actions-bar">
      <button @click="$emit('logout')" class="btn-danger">Logout</button>
      
      <div class="right-actions">
        <button 
          @click="gererSuppression" 
          class="btn-danger" 
          :disabled="!idSelectionne"
        >
          Supprimer
        </button>
        
        <button 
          @click="$emit('open-booking')" 
          class="btn-primary"
        >
          Prendre un autre rendez-vous
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/RendezVousList.css"></style>
