<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue';
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
  (e: 'reservation-effectuee'): void;
  (e: 'annuler'): void;
}>();

// DAOs
const consultationDAO = new ConsultationDAO();
const medecinDAO = new MedecinDAO();
const specialiteDAO = new SpecialiteDAO();
const { afficherToast } = utiliserToast();
const showModal = inject<(options: any) => Promise<any>>('showModal');

// Données
const consultations = ref<Consultation[]>([]);
const medecins = ref<Medecin[]>([]);
const specialites = ref<Specialite[]>([]);

// Filtres
const idSpecialiteSelectionnee = ref<number | null>(null);
const idMedecinSelectionne = ref<number | null>(null);

// Sélection
const idConsultationSelectionnee = ref<number | null>(null);

// Chargement/Erreur
const chargement = ref(false);
const erreur = ref('');

// Chargement des données
onMounted(async () => {
  chargement.value = true;
  try {
    console.log('🔍 Chargement des consultations disponibles...');
    const [cons, meds, specs] = await Promise.all([
      consultationDAO.obtenirDisponibles(),
      medecinDAO.obtenirTout(),
      specialiteDAO.obtenirTout()
    ]);
    console.log('📋 Consultations disponibles:', cons);
    console.log('👨‍⚕️ Médecins:', meds);
    console.log('🏥 Spécialités:', specs);
    consultations.value = cons;
    medecins.value = meds;
    specialites.value = specs;
  } catch (e: any) {
    erreur.value = "Erreur lors du chargement des données";
    console.error('❌ Erreur:', e);
  } finally {
    chargement.value = false;
  }
});

// Calculés
const consultationsFiltrees = computed(() => {
  return consultations.value.filter(c => {
    let correspond = true;
    
    // Filtrer par Médecin
    if (idMedecinSelectionne.value) {
      if (c.doctor_id !== idMedecinSelectionne.value) correspond = false;
    }

    // Filtrer par Spécialité (via Médecin)
    if (correspond && idSpecialiteSelectionnee.value) {
      const med = medecins.value.find(m => m.id === c.doctor_id);
      if (med && med.specialiteId !== idSpecialiteSelectionnee.value) {
        correspond = false;
      }
    }

    return correspond;
  });
});

// Aides pour l'affichage
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

// Formater la date et l'heure
const formaterDateHeure = (consultation: Consultation) => {
  const dateStr = consultation.date;
  let heureStr = '00:00:00';
  if (consultation.hour) {
    heureStr = consultation.hour;
  }
  
  const dateHeureStr = dateStr + 'T' + heureStr;
  const objetDate = new Date(dateHeureStr);
  
  return objetDate.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Actions
const selectionnerLigne = (id: number) => {
  idConsultationSelectionnee.value = id;
};

const gererReservation = async () => {
  if (!idConsultationSelectionnee.value) {
    afficherToast({ message: 'Veuillez sélectionner une consultation', type: 'warning' });
    return;
  }

  if (!props.patientId || props.patientId <= 0) {
    afficherToast({ message: 'Erreur : ID patient invalide. Veuillez vous reconnecter.', type: 'error' });
    console.error('❌ patientId invalide:', props.patientId, typeof props.patientId);
    return;
  }

  if (showModal) {
    const motif = await showModal({
      titre: 'Motif de la consultation',
      message: 'Veuillez saisir le motif de la consultation :',
      type: 'prompt',
      placeholder: 'Ex: Consultation de routine, douleur, etc.',
      texteConfirmation: 'Réserver',
      texteAnnulation: 'Annuler'
    });

    if (motif && typeof motif === 'string' && motif.trim() !== '') {
      console.log('🔵 Tentative de réservation:', {
        consultationId: idConsultationSelectionnee.value,
        patientId: props.patientId,
        patientIdType: typeof props.patientId,
        motif: motif
      });

      try {
        await consultationDAO.reserver(idConsultationSelectionnee.value, props.patientId, motif);
        afficherToast({ message: 'Réservation effectuée avec succès !', type: 'success' });
        emit('reservation-effectuee');
      } catch (e: any) {
        console.error('❌ Erreur de réservation:', e);
        const msgErreur = e.message || "Erreur lors de la réservation";
        afficherToast({ message: 'Erreur lors de la réservation: ' + msgErreur, type: 'error' });
      }
    } else if (motif !== false) {
      afficherToast({ message: 'Le motif est obligatoire', type: 'warning' });
    }
  }
};

const gererAnnulation = () => {
  emit('annuler');
};
</script>

<template>
  <div class="consultation-dispo">
    <h3>Nouvelle Réservation</h3>

    <div class="filters">
      <div class="filter-group">
        <label>Spécialité :</label>
        <select v-model="idSpecialiteSelectionnee" @change="idConsultationSelectionnee = null">
          <option :value="null">Toutes</option>
          <option v-for="s in specialites" :key="s.id" :value="s.id">
            {{ s.nom }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Médecin :</label>
        <select v-model="idMedecinSelectionne" @change="idConsultationSelectionnee = null">
          <option :value="null">Tous</option>
          <option v-for="m in medecins" :key="m.id" :value="m.id">
            {{ m.nom }} {{ m.prenom }}
          </option>
        </select>
      </div>
    </div>

    <LoadingSpinner v-if="chargement" message="Chargement des consultations disponibles..." />
    <div v-else-if="erreur" class="error">{{ erreur }}</div>
    
    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Médecin</th>
            <th>Spécialité</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="c in consultationsFiltrees" 
            :key="c.id"
            :class="{ selected: idConsultationSelectionnee === c.id }"
            @click="selectionnerLigne(c.id)"
          >
            <td>{{ formaterDateHeure(c) }}</td>
            <td>{{ obtenirNomMedecin(c.doctor_id) }}</td>
            <td>{{ obtenirNomSpecialite(c.doctor_id) }}</td>
          </tr>
          <tr v-if="consultationsFiltrees.length === 0">
            <td colspan="3" class="empty">Aucune consultation disponible</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="actions">
      <button @click="gererAnnulation" class="btn-cancel">Annuler</button>
      <button 
        @click="gererReservation" 
        class="btn-confirm" 
        :disabled="!idConsultationSelectionnee"
      >
        Réserver
      </button>
    </div>
  </div>
</template>

<style scoped src="../styles/ConsultationDispo.css"></style>
