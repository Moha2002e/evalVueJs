<script setup lang="ts">
import { ref } from 'vue';
import LoginPatient from './components/LoginPatient.vue';
import RendezVousList from './components/RendezVousList.vue';
import ConsultationDispo from './components/ConsultationDispo.vue';
import type { Patient } from './models';

// État de l'application
const utilisateurCourant = ref<Patient | null>(null);
const afficherDisponibles = ref(false);
const cleRafraichissement = ref(0);

// Gestionnaires d'événements
const gererConnexion = (patient: Patient) => {
  utilisateurCourant.value = patient;
  afficherDisponibles.value = false;
};

const gererDeconnexion = () => {
  utilisateurCourant.value = null;
  afficherDisponibles.value = false;
};

const ouvrirDisponibles = () => {
  afficherDisponibles.value = true;
};

const fermerDisponibles = () => {
  afficherDisponibles.value = false;
  cleRafraichissement.value++;
};
</script>

<template>
  <!-- Main Application Wrapper -->
  <div class="app-background">
    <div class="app-container">
      
      <!-- Header avec effet Glassmorphism -->
      <header class="app-header fade-in" v-if="utilisateurCourant">
        <div class="logo">
          🏥 <span class="brand-name">MediBooking</span>
        </div>
        <div class="user-profile">
          <div class="avatar">
           {{ utilisateurCourant.prenom.charAt(0) }}{{ utilisateurCourant.nom.charAt(0) }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ utilisateurCourant.prenom }} {{ utilisateurCourant.nom }}</span>
            <span class="user-status">Patient connecté</span>
          </div>
        </div>
      </header>

      <main class="main-content">
        <!-- Composant 1 : Login -->
        <section class="section-login" :class="{ 'minimized': utilisateurCourant }">
          <LoginPatient @login="gererConnexion" />
        </section>

        <!-- Zone Principale (Liste + Réservation) -->
        <div v-if="utilisateurCourant" class="dashboard-zone">
          
          <!-- Transitions fluides entre les vues -->
          <transition name="slide-fade" mode="out-in">
            
            <!-- VUE 1: LISTE DES RDV -->
            <div v-if="!afficherDisponibles" key="list" class="dashboard-panel">
               <RendezVousList 
                :patientId="utilisateurCourant.id"
                :key="cleRafraichissement"
                @logout="gererDeconnexion"
                @open-booking="ouvrirDisponibles"
              />
            </div>

            <!-- VUE 2: RÉSERVATION -->
            <div v-else key="booking" class="dashboard-panel">
              <ConsultationDispo 
                :patientId="utilisateurCourant.id"
                @reserve="fermerDisponibles"
                @cancel="fermerDisponibles"
              />
            </div>

          </transition>

        </div>
      </main>

      <footer class="app-footer">
        © 2026 MediBooking — Votre santé, notre priorité.
      </footer>
    </div>
  </div>
</template>

<style scoped>
.app-background {
  /* Dégradé subtil blanc clinique vers bleu très pâle */
  background: linear-gradient(180deg, #ffffff 0%, #e0f2fe 100%);
  min-height: 100vh;
  padding: 2rem;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(8, 145, 178, 0.05); /* Ombre cyan très légère */
  border-bottom: 4px solid var(--primary-color); /* Ligne de chartre sous le header */
}

.brand-name {
  font-weight: 800;
  font-size: 1.4rem;
  color: var(--primary-color);
  letter-spacing: -0.5px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  background: var(--primary-color);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%; /* Rond c'est plus standard */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(8, 145, 178, 0.3);
}

.user-info {
  display: flex;
  flex-direction: column;
}
.user-name { font-weight: 700; color: #334155; }
.user-status { font-size: 0.75rem; color: var(--accent-color); font-weight: 600; text-transform: uppercase;}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.section-login {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  display: flex;
  justify-content: center;
}

/* État minimisé : On cache le login quand connecté, ou on le réduit */
.section-login.minimized {
  /* Option A : On le cache complètement avec une belle animation */
  opacity: 0;
  height: 0;
  transform: translateY(-20px);
  overflow: hidden;
  margin: 0;
  pointer-events: none;
}

.dashboard-zone {
  width: 100%;
}

.dashboard-panel {
  width: 100%;
}

/* Animations de transition améliorées */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.slide-fade-enter-from {
  transform: translateY(30px) scale(0.95);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-30px) scale(0.95);
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* Animation pour l'en-tête */
.app-header {
  animation: headerSlideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes headerSlideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation pour les panneaux du dashboard */
.dashboard-panel {
  animation: panelFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes panelFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.app-footer {
  text-align: center;
  margin-top: 3rem;
  color: #6b7280;
  font-size: 0.85rem;
}
</style>
