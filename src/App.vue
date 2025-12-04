<script setup lang="ts">
import { ref, provide } from 'vue';
import LoginPatient from './components/LoginPatient.vue';
import RendezVousList from './components/RendezVousList.vue';
import ConsultationDispo from './components/ConsultationDispo.vue';
import ToastContainer from './components/ToastContainer.vue';
import Modal from './components/Modal.vue';
import { utiliserModal } from './composables/useModal';
import type { Patient } from './models';

// État de l'application
const utilisateurCourant = ref<Patient | null>(null);
const afficherDisponibles = ref(false);
const cleRafraichissementListe = ref(0);

// Modal global
const { modaleVisible, optionsModale, afficherModale, gererConfirmation, gererAnnulation } = utiliserModal();

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
  // On incrémente la clé pour forcer le rechargement de la liste des RDV
  cleRafraichissementListe.value++;
};

// Exposer afficherModale pour les composants enfants
provide('showModal', afficherModale);
</script>

<template>
  <div class="app-container">
    <main>
      <div class="layout">
        <!-- Composant 1 : Login / Info Patient (Toujours visible) -->
        <section :class="['section-login', { 'centered': !utilisateurCourant }]">
          <LoginPatient 
            :patient="utilisateurCourant" 
            @logged="gererConnexion" 
          />
        </section>

        <!-- Composant 2 : Liste des RDV (Visible si connecté) -->
        <section v-if="utilisateurCourant && utilisateurCourant.id" class="section-list">
          <RendezVousList 
            :patientId="utilisateurCourant.id" 
            :key="cleRafraichissementListe"
            @logout="gererDeconnexion"
            @open-booking="ouvrirDisponibles"
          />
        </section>

        <!-- Composant 3 : Prise de RDV (Visible sur demande) -->
        <section v-if="afficherDisponibles" class="section-booking">
          <ConsultationDispo 
            :patientId="utilisateurCourant!.id"
            @reservation-effectuee="fermerDisponibles"
            @annuler="fermerDisponibles"
          />
        </section>
      </div>
    </main>
    
    <!-- Composants globaux -->
    <ToastContainer />
    <Modal
      :visible="modaleVisible"
      :titre="optionsModale.titre"
      :message="optionsModale.message"
      :type="optionsModale.type"
      :placeholder="optionsModale.placeholder"
      :texte-confirmation="optionsModale.texteConfirmation"
      :texte-annulation="optionsModale.texteAnnulation"
      @confirm="gererConfirmation"
      @cancel="gererAnnulation"
      @update:visible="modaleVisible = $event"
    />
  </div>
</template>

<style scoped src="./styles/App.css"></style>
