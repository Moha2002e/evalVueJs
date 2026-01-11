<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ConsultationDAO } from '../dao/ConsultationDAO';
import { MedecinDAO } from '../dao/MedecinDAO';
import { SpecialiteDAO } from '../dao/SpecialiteDAO';
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

const chargerDonnees = async () => {
  chargement.value = true;
  try {
    const [cons, meds, specs] = await Promise.all([
      consultationDAO.obtenirParPatient(props.patientId),
      medecinDAO.obtenirTout(),
      specialiteDAO.obtenirTout()
    ]);
    consultations.value = cons;
    medecins.value = meds;
    specialites.value = specs;
  } catch (e) {
    console.error('Erreur chargement', e);
  } finally {
    chargement.value = false;
  }
};

onMounted(chargerDonnees);

// Helpers pour l'affichage
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

const supprimerSelection = async () => {
  if (!idSelectionne.value) return;
  if (confirm("Voulez-vous vraiment supprimer ce rendez-vous ?")) {
    try {
      await consultationDAO.supprimer(idSelectionne.value);
      await chargerDonnees();
      idSelectionne.value = null;
    } catch (e) {
      alert("Erreur lors de la suppression");
    }
  }
};
</script>

<template>
  <div class="rdv-card fade-in">
    <div class="header-actions">
      <h3>📅 Mes Rendez-vous</h3>
      <button class="btn-sm btn-outline-danger" @click="$emit('logout')">Déconnexion</button>
    </div>

    <div class="table-wrapper">
      <table class="modern-table">
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
            v-for="(c, index) in consultations" 
            :key="c.id" 
            :data-index="index"
            @click="selectionner(c.id)"
            :class="{ selected: idSelectionne === c.id }"
            class="table-row-animated"
          >
            <td>
              <div class="datetime">
                <span class="date">{{ c.date }}</span>
                <span class="time">{{ c.hour }}</span>
              </div>
            </td>
            <td class="font-bold">{{ getNomMedecin(c.doctor_id) }}</td>
            <td><span class="tag-specialite">{{ getNomSpecialite(c.doctor_id) }}</span></td>
            <td>
              <div class="radio-indicator">
                <transition name="radio-dot">
                  <div class="dot" v-if="idSelectionne === c.id"></div>
                </transition>
              </div>
            </td>
          </tr>
          <tr v-if="consultations.length === 0 && !chargement" class="empty-state-row">
            <td colspan="4" class="empty-state">
              Vous n'avez aucun rendez-vous prévu pour le moment.
            </td>
          </tr>
          <tr v-if="chargement" class="loading-state-row">
             <td colspan="4" class="loading-state">
               <div class="loading-animation">
                 <span></span><span></span><span></span>
               </div>
               Chargement de vos données...
             </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-actions">
      <button 
        class="btn-danger" 
        @click="supprimerSelection" 
        :disabled="!idSelectionne"
      >
        <span class="icon">🗑️</span> Supprimer
      </button>
      
      <button class="btn-primary" @click="$emit('open-booking')">
        <span class="icon">➕</span> Prendre un rendez-vous
      </button>
    </div>
  </div>
</template>

<style scoped>
.rdv-card {
  background: var(--surface-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  border: 1.5px solid var(--border-light);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.rdv-card:hover {
  box-shadow: var(--shadow-xl);
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 2px solid var(--border-color);
  position: relative;
  animation: slideIn 0.5s ease-out;
}

.header-actions::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 80px;
  height: 2px;
  background: var(--primary-color);
  border-radius: 2px;
  animation: expandWidth 0.8s ease-out 0.3s both;
}

@keyframes expandWidth {
  from {
    width: 0;
  }
  to {
    width: 80px;
  }
}

.header-actions h3 {
  font-size: 1.625rem;
  color: var(--text-main);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--border-color);
  background: var(--surface-color);
  box-shadow: var(--shadow-sm);
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.modern-table th {
  background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
  color: var(--text-main);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  padding: 1.25rem 1rem;
  text-align: left;
  border-bottom: 2px solid var(--border-color);
  position: relative;
}

.modern-table td {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-main);
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.modern-table tr {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.modern-table tr:hover {
  background-color: var(--zone-info);
}

.modern-table tr:hover td {
  background-color: var(--zone-info);
  color: var(--text-main);
  transform: translateX(2px);
}

.modern-table tr.selected {
  background-color: var(--primary-light);
  border-left: 5px solid var(--primary-color);
  box-shadow: inset 0 0 0 1px rgba(0, 102, 204, 0.1);
}

.modern-table tr.selected td {
  color: var(--primary-color);
  font-weight: 600;
  background-color: var(--primary-light);
}

/* Badges styling */
.datetime {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.date {
  font-weight: 600;
  color: var(--text-main);
}
.time {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-family: monospace;
}

.tag-specialite {
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

.modern-table tr.selected .radio-indicator {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
}

.dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.text-muted {
  color: var(--text-secondary);
  font-style: italic;
}

.font-bold {
  font-weight: 600;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 3rem;
  color: #475569;
  background-color: #ffffff;
}

.footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  color: var(--text-on-primary);
  padding: 0.875rem 1.75rem;
  box-shadow: var(--shadow-md);
  font-weight: 600;
  letter-spacing: 0.02em;
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary-color) 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-danger {
  background: #ffffff;
  color: var(--danger-color);
  border: 2px solid var(--danger-color);
  font-weight: 600;
}
.btn-danger:hover:not(:disabled) {
  background: var(--danger-color);
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

.btn-outline-danger {
  background: transparent;
  color: var(--text-secondary);
  border: 1.5px solid var(--border-color);
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}
.btn-outline-danger:hover {
  border-color: var(--danger-color);
  color: var(--danger-color);
  background: rgba(220, 53, 69, 0.05);
  transform: translateY(-1px);
}

.icon {
  margin-right: 0.5rem;
  display: inline-block;
  transition: transform 0.2s ease;
}

.btn-primary:hover .icon,
.btn-danger:hover .icon {
  transform: scale(1.15) rotate(5deg);
}

/* Animations des lignes de tableau */
.table-row-animated {
  animation: slideInRow 0.4s ease-out forwards;
  opacity: 0;
}

.table-row-animated:nth-child(1) { animation-delay: 0.05s; }
.table-row-animated:nth-child(2) { animation-delay: 0.1s; }
.table-row-animated:nth-child(3) { animation-delay: 0.15s; }
.table-row-animated:nth-child(4) { animation-delay: 0.2s; }
.table-row-animated:nth-child(5) { animation-delay: 0.25s; }
.table-row-animated:nth-child(n+6) { animation-delay: 0.3s; }

@keyframes slideInRow {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animation pour les lignes lors du changement */
.modern-table tbody tr {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation radio dot */
.radio-dot-enter-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.radio-dot-leave-active {
  transition: all 0.2s ease-in;
}

.radio-dot-enter-from {
  opacity: 0;
  transform: scale(0);
}

.radio-dot-leave-to {
  opacity: 0;
  transform: scale(0);
}

/* Animation tag spécialité */
.tag-specialite {
  animation: tagAppear 0.5s ease-out;
}

@keyframes tagAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animation empty state */
.empty-state-row {
  animation: fadeIn 0.5s ease-out;
}

/* Animation loading state */
.loading-state-row {
  animation: fadeIn 0.3s ease-out;
}

.loading-animation {
  display: inline-flex;
  gap: 0.5rem;
  margin-right: 0.75rem;
  align-items: center;
}

.loading-animation span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
  animation: loadingBounce 1.4s ease-in-out infinite both;
}

.loading-animation span:nth-child(1) { animation-delay: -0.32s; }
.loading-animation span:nth-child(2) { animation-delay: -0.16s; }
.loading-animation span:nth-child(3) { animation-delay: 0; }

@keyframes loadingBounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>
