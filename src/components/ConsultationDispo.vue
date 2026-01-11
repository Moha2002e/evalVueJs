<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ConsultationDAO } from '../dao/ConsultationDAO';
import { MedecinDAO } from '../dao/MedecinDAO';
import { SpecialiteDAO } from '../dao/SpecialiteDAO';
import type { Consultation, Medecin, Specialite } from '../models';

const props = defineProps<{
  patientId: number;
}>();

const emit = defineEmits<{
  (e: 'reserve'): void;
  (e: 'cancel'): void;
}>();

const consultations = ref<Consultation[]>([]);
const medecins = ref<Medecin[]>([]);
const specialites = ref<Specialite[]>([]);
const chargement = ref(false);

const filterSpecialite = ref<number | null>(null);
const filterMedecin = ref<number | null>(null);
const idSelectionne = ref<number | null>(null);

const consultationDAO = new ConsultationDAO();
const medecinDAO = new MedecinDAO();
const specialiteDAO = new SpecialiteDAO();

onMounted(async () => {
  chargement.value = true;
  try {
    const [cons, meds, specs] = await Promise.all([
      consultationDAO.obtenirDisponibles(),
      medecinDAO.obtenirTout(),
      specialiteDAO.obtenirTout()
    ]);
    consultations.value = cons;
    medecins.value = meds;
    specialites.value = specs;
  } catch (e) {
    console.error(e);
  } finally {
    chargement.value = false;
  }
});

// Filtrage
const listeFiltree = computed(() => {
  return consultations.value.filter(c => {
    let ok = true;
    if (filterMedecin.value && c.doctor_id !== filterMedecin.value) ok = false;
    
    if (filterSpecialite.value) {
      const doc = medecins.value.find(m => m.id === c.doctor_id);
      if (doc && doc.specialite_id !== filterSpecialite.value) ok = false;
    }
    return ok;
  });
});

const getNomMedecin = (id: number) => {
  const m = medecins.value.find(x => x.id === id);
  return m ? `${m.last_name} ${m.first_name}` : id;
};

const getNomSpecialite = (docId: number) => {
  const m = medecins.value.find(x => x.id === docId);
  if (!m) return '-';
  const s = specialites.value.find(x => x.id === m.specialite_id);
  return s ? s.name : '-';
};

const selectionner = (id: number) => {
  idSelectionne.value = (idSelectionne.value === id) ? null : id;
};

const reserver = async () => {
  if (!idSelectionne.value) return;
  const motif = prompt("Veuillez entrer le motif du rendez-vous :");
  if (motif) {
    try {
      await consultationDAO.reserver(idSelectionne.value, props.patientId, motif);
      emit('reserve');
    } catch (e) {
      alert("Erreur lors de la réservation");
    }
  }
};
</script>

<template>
  <div class="booking-card fade-in">
    <div class="card-header">
      <h3>🏥 Nouvelle Réservation</h3>
      <p>Trouvez le créneau qui vous convient parmi les disponibilités.</p>
    </div>

    <!-- Filtres stylisés -->
    <div class="filters-bar">
      <div class="filter-group">
        <label>🩺 Spécialité</label>
        <div class="select-wrapper">
          <select v-model="filterSpecialite" @change="idSelectionne = null">
            <option :value="null">Toutes les spécialités</option>
            <option v-for="s in specialites" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
      </div>
      
      <div class="filter-group">
        <label>👨‍⚕️ Médecin</label>
        <div class="select-wrapper">
          <select v-model="filterMedecin" @change="idSelectionne = null">
            <option :value="null">Tous les médecins</option>
            <option v-for="m in medecins" :key="m.id" :value="m.id">{{ m.last_name }} {{ m.first_name }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-frame">
      <table class="booking-table">
        <thead>
          <tr>
            <th>Date & Heure</th>
            <th>Médecin</th>
            <th>Spécialité</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(c, index) in listeFiltree" 
            :key="c.id" 
            :data-index="index"
            @click="selectionner(c.id)"
            :class="{ active: idSelectionne === c.id }"
            class="booking-row-animated"
          >
            <td>
              <div class="datetime">
                <span class="date">{{ c.date }}</span>
                <span class="time">{{ c.hour }}</span>
              </div>
            </td>
            <td><strong>{{ getNomMedecin(c.doctor_id) }}</strong></td>
            <td><span class="badge">{{ getNomSpecialite(c.doctor_id) }}</span></td>
            <td>
              <div class="radio-indicator">
                <transition name="radio-pulse">
                  <div class="dot" v-if="idSelectionne === c.id"></div>
                </transition>
              </div>
            </td>
          </tr>
          <tr v-if="listeFiltree.length === 0 && !chargement" class="empty-state-row">
            <td colspan="4" class="empty-state">Aucun créneau disponible pour ces critères.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-actions">
      <button class="btn-secondary" @click="$emit('cancel')">Annuler</button>
      <button class="btn-primary" @click="reserver" :disabled="!idSelectionne">
        Confirmer la réservation
      </button>
    </div>
  </div>
</template>

<style scoped>
.booking-card {
  background: var(--surface-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: 2.25rem;
  border: 1.5px solid var(--border-light);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.booking-card:hover {
  box-shadow: var(--shadow-xl);
}

.card-header {
  margin-bottom: 2.25rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
  position: relative;
}

.card-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 2px;
  animation: expandGradient 1s ease-out 0.4s both;
}

@keyframes expandGradient {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 100px;
    opacity: 1;
  }
}

.card-header h3 {
  font-size: 1.75rem;
  color: var(--text-main);
  margin-bottom: 0.625rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.card-header p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

.filters-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.75rem;
  margin-bottom: 2.25rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 1.75rem;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  animation: slideIn 0.6s ease-out 0.2s both;
  opacity: 0;
}

.filter-group label {
  display: block;
  margin-bottom: 0.625rem;
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.9375rem;
  letter-spacing: 0.01em;
}

/* Custom Select Styling */
.select-wrapper {
  position: relative;
}
.select-wrapper select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231e293b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
  background-color: #ffffff;
  color: var(--text-main);
  border: 1px solid #e5e7eb;
}

.select-wrapper select option {
  background-color: #ffffff;
  color: var(--text-main);
  padding: 0.5rem;
}

.table-frame {
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  max-height: 450px;
  overflow-y: auto;
  background: var(--surface-color);
  box-shadow: var(--shadow-sm);
}

.booking-table {
  width: 100%;
  border-collapse: collapse;
}

.booking-table th {
  background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.25rem 1rem;
  text-align: left;
  font-weight: 700;
  color: var(--text-main);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 2px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.booking-table td {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-main);
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.booking-table tr {
  cursor: pointer;
  transition: all 0.2s;
}

.booking-table tr:hover {
  background-color: var(--zone-info);
}

.booking-table tr:hover td {
  background-color: var(--zone-info);
  color: var(--text-main);
  transform: translateX(2px);
}

.booking-table tr.active {
  background-color: var(--primary-light);
  border-left: 5px solid var(--primary-color);
  box-shadow: inset 0 0 0 1px rgba(0, 102, 204, 0.1);
}

.booking-table tr.active td {
  color: var(--primary-color);
  font-weight: 600;
  background-color: var(--primary-light);
}

.datetime {
  display: flex;
  flex-direction: column;
}
.date { font-weight: 600; color: var(--text-main); }
.time { font-size: 0.85rem; color: var(--text-secondary); }

.badge {
  background: linear-gradient(135deg, rgba(0, 168, 107, 0.15) 0%, #c8e6c9 100%);
  color: #1b5e20;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-xl);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1px solid rgba(27, 94, 32, 0.2);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: inline-block;
}

/* Radio Indicator for selection */
.radio-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.booking-table tr.active .radio-indicator {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
}

.dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s;
}

.booking-table tr.active .dot {
  opacity: 1;
  transform: scale(1);
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary {
  background: #ffffff;
  border: 2px solid var(--border-color);
  color: var(--text-main);
  font-weight: 600;
}
.btn-secondary:hover {
  background: var(--bg-color);
  border-color: var(--text-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  color: var(--text-on-primary);
  padding: 0.875rem 2rem;
  box-shadow: var(--shadow-md);
  font-weight: 600;
  letter-spacing: 0.02em;
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary-color) 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #475569;
  background-color: #ffffff;
  animation: fadeIn 0.5s ease-out;
}

.empty-state-row {
  animation: fadeIn 0.5s ease-out;
}

/* Animations des lignes de réservation */
.booking-row-animated {
  animation: slideInBooking 0.4s ease-out forwards;
  opacity: 0;
}

.booking-row-animated:nth-child(1) { animation-delay: 0.05s; }
.booking-row-animated:nth-child(2) { animation-delay: 0.1s; }
.booking-row-animated:nth-child(3) { animation-delay: 0.15s; }
.booking-row-animated:nth-child(4) { animation-delay: 0.2s; }
.booking-row-animated:nth-child(5) { animation-delay: 0.25s; }
.booking-row-animated:nth-child(n+6) { animation-delay: 0.3s; }

@keyframes slideInBooking {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Animation pour les lignes lors du changement */
.booking-table tbody tr {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation radio pulse */
.radio-pulse-enter-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.radio-pulse-leave-active {
  transition: all 0.25s ease-in;
}

.radio-pulse-enter-from {
  opacity: 0;
  transform: scale(0) rotate(180deg);
}

.radio-pulse-leave-to {
  opacity: 0;
  transform: scale(0);
}

.booking-table tr.active .radio-indicator {
  animation: pulseRing 0.6s ease-out;
}

@keyframes pulseRing {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 102, 204, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 102, 204, 0);
  }
}

/* Animation badge */
.badge {
  animation: badgePop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes badgePop {
  from {
    opacity: 0;
    transform: scale(0.7) rotate(-5deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* Animation pour les groupes de filtres */
.filter-group {
  animation: filterSlide 0.5s ease-out forwards;
  opacity: 0;
}

.filter-group:nth-child(1) {
  animation-delay: 0.3s;
}

.filter-group:nth-child(2) {
  animation-delay: 0.4s;
}

@keyframes filterSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation pour les selects */
.select-wrapper select:focus {
  animation: selectFocus 0.3s ease-out;
}

@keyframes selectFocus {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}
</style>
