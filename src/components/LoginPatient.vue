<script setup lang="ts">
import { ref } from 'vue';
import { PatientDAO } from '../dao/PatientDAO';
import type { Patient } from '../models';

const emit = defineEmits<{
  (e: 'login', patient: Patient): void;
}>();

// Variables du formulaire
const nom = ref('');
const prenom = ref('');
const dateNaissance = ref('');
const numeroPatient = ref<number | null>(null);
const estNouveauPatient = ref(false);
const messageErreur = ref('');
const enChargement = ref(false);

const patientDAO = new PatientDAO();

// Fonction appelée quand on clique sur "Se connecter"
const gererConnexion = async () => {
  messageErreur.value = '';
  enChargement.value = true;
  
  try {
    const lePatient = await patientDAO.connecterPatient(
      nom.value, 
      prenom.value, 
      dateNaissance.value,
      numeroPatient.value, 
      estNouveauPatient.value
    );
    
    // Si tout est bon, on envoie l'événement au parent
    emit('login', lePatient);
    
  } catch (erreur: any) {
    console.error(erreur);
    messageErreur.value = erreur.message || 'Erreur de connexion';
  } finally {
    enChargement.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card fade-in">
      <div class="card-header">

        <h2 class="typewriter-title">
          <span class="typewriter-char" style="--i: 0">B</span>
          <span class="typewriter-char" style="--i: 1">i</span>
          <span class="typewriter-char" style="--i: 2">e</span>
          <span class="typewriter-char" style="--i: 3">n</span>
          <span class="typewriter-char" style="--i: 4">v</span>
          <span class="typewriter-char" style="--i: 5">e</span>
          <span class="typewriter-char" style="--i: 6">u</span>
          <span class="typewriter-char" style="--i: 7">&nbsp;</span>
          <span class="typewriter-char" style="--i: 8">P</span>
          <span class="typewriter-char" style="--i: 9">a</span>
          <span class="typewriter-char" style="--i: 10">t</span>
          <span class="typewriter-char" style="--i: 11">i</span>
          <span class="typewriter-char" style="--i: 12">e</span>
          <span class="typewriter-char" style="--i: 13">n</span>
          <span class="typewriter-char" style="--i: 14">t</span>
          <span class="typewriter-char" style="--i: 15">s</span>
        </h2>
        <p class="typewriter-subtitle">
          <span class="subtitle-char" style="--i: 0">C</span>
          <span class="subtitle-char" style="--i: 1">o</span>
          <span class="subtitle-char" style="--i: 2">n</span>
          <span class="subtitle-char" style="--i: 3">n</span>
          <span class="subtitle-char" style="--i: 4">e</span>
          <span class="subtitle-char" style="--i: 5">c</span>
          <span class="subtitle-char" style="--i: 6">t</span>
          <span class="subtitle-char" style="--i: 7">e</span>
          <span class="subtitle-char" style="--i: 8">z</span>
          <span class="subtitle-char" style="--i: 9">-</span>
          <span class="subtitle-char" style="--i: 10">v</span>
          <span class="subtitle-char" style="--i: 11">o</span>
          <span class="subtitle-char" style="--i: 12">u</span>
          <span class="subtitle-char" style="--i: 13">s</span>
          <span class="subtitle-char" style="--i: 14">&nbsp;</span>
          <span class="subtitle-char" style="--i: 15">p</span>
          <span class="subtitle-char" style="--i: 16">o</span>
          <span class="subtitle-char" style="--i: 17">u</span>
          <span class="subtitle-char" style="--i: 18">r</span>
          <span class="subtitle-char" style="--i: 19">&nbsp;</span>
          <span class="subtitle-char" style="--i: 20">g</span>
          <span class="subtitle-char" style="--i: 21">é</span>
          <span class="subtitle-char" style="--i: 22">r</span>
          <span class="subtitle-char" style="--i: 23">e</span>
          <span class="subtitle-char" style="--i: 24">r</span>
          <span class="subtitle-char" style="--i: 25">&nbsp;</span>
          <span class="subtitle-char" style="--i: 26">v</span>
          <span class="subtitle-char" style="--i: 27">o</span>
          <span class="subtitle-char" style="--i: 28">s</span>
          <span class="subtitle-char" style="--i: 29">&nbsp;</span>
          <span class="subtitle-char" style="--i: 30">r</span>
          <span class="subtitle-char" style="--i: 31">e</span>
          <span class="subtitle-char" style="--i: 32">n</span>
          <span class="subtitle-char" style="--i: 33">d</span>
          <span class="subtitle-char" style="--i: 34">e</span>
          <span class="subtitle-char" style="--i: 35">z</span>
          <span class="subtitle-char" style="--i: 36">-</span>
          <span class="subtitle-char" style="--i: 37">v</span>
          <span class="subtitle-char" style="--i: 38">o</span>
          <span class="subtitle-char" style="--i: 39">u</span>
          <span class="subtitle-char" style="--i: 40">s</span>
        </p>
      </div>

      <form @submit.prevent="gererConnexion" class="login-form">
        <div class="input-group">
          <label for="nom">Nom</label>
          <input id="nom" v-model="nom" type="text" placeholder="Votre nom" required />
        </div>

        <div class="input-group">
          <label for="prenom">Prénom</label>
          <input id="prenom" v-model="prenom" type="text" placeholder="Votre prénom" required />
        </div>

        <div class="input-group">
          <label for="dateNaissance">Date de naissance</label>
          <input id="dateNaissance" v-model="dateNaissance" type="date" required />
        </div>

        <div class="checkbox-group">
          <input type="checkbox" id="nouveau" v-model="estNouveauPatient" />
          <label for="nouveau">Je suis un nouveau patient</label>
        </div>

        <div class="input-group transition-height" v-if="!estNouveauPatient">
          <label for="numeroPatient">Numéro Patient</label>
          <input id="numeroPatient" v-model="numeroPatient" type="number" placeholder="Ex: 123456" required />
        </div>

        <button type="submit" class="btn-primary" :disabled="enChargement">
          <span v-if="enChargement" class="spinner"></span>
          <span v-else>Se connecter</span>
        </button>

        <div v-if="messageErreur" class="error-banner">
          {{ messageErreur }}
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.login-card {
  background: var(--surface-color);
  padding: 2.5rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 420px;
  border: 1.5px solid var(--border-light);
  animation: loginCardAppear 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 2s infinite;
}

@keyframes loginCardAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
  animation: headerSlide 0.6s ease-out 0.2s both;
  opacity: 0;
}

.typewriter-subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  display: inline-block;
  overflow: hidden;
  margin-bottom: 0.5rem;
  text-align: center;
  width: 100%;
}

.typewriter-title {
  color: var(--primary-color);
  margin-bottom: 2rem;
  font-size: 1.8rem;
  display: inline-block;
  font-weight: 600;
  overflow: hidden;
  text-align: center;
  width: 100%;
}

.typewriter-char {
  display: inline-block;
  opacity: 0;
  animation: typeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: calc(var(--i) * 0.1s + 2s);
  transform: translateY(20px);
}

@keyframes typeIn {
  0% {
    opacity: 0;
    transform: translateY(20px) rotateX(90deg);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-2px) rotateX(45deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

.typewriter-subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  display: inline-block;
  overflow: hidden;
}

.subtitle-char {
  display: inline-block;
  opacity: 0;
  animation: typeInSubtitle 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: calc(var(--i) * 0.04s + 0.3s);
  transform: translateY(15px);
}

@keyframes typeInSubtitle {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  50% {
    opacity: 0.6;
    transform: translateY(-1px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Effet curseur clignotant après le texte */
.typewriter-title::after {
  content: '';
  display: inline-block;
  width: 3px;
  height: 1.2em;
  background: var(--primary-color);
  margin-left: 4px;
  animation: blinkCursor 1s infinite;
  animation-delay: 4.2s;
  vertical-align: baseline;
}

@keyframes blinkCursor {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}

@keyframes headerSlide {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes titleBounce {
  0% {
    opacity: 0;
    transform: translateY(-15px) scale(0.9);
  }
  60% {
    transform: translateY(5px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: inputSlide 0.5s ease-out forwards;
  opacity: 0;
}

.input-group:nth-child(1) { animation-delay: 0.7s; }
.input-group:nth-child(2) { animation-delay: 0.8s; }
.input-group:nth-child(3) { animation-delay: 0.9s; }
.input-group:nth-child(4) { animation-delay: 1s; }
.input-group:nth-child(5) { animation-delay: 1.1s; }

@keyframes inputSlide {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.input-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: color 0.2s ease;
}

.input-group:focus-within label {
  color: var(--primary-color);
}

.input-group input:focus {
  animation: inputFocus 0.3s ease-out;
}

@keyframes inputFocus {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.checkbox-group label {
  cursor: pointer;
  font-weight: 500;
  color: var(--text-main);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  color: white;
  margin-top: 1rem;
  font-size: 1.1rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.error-banner {
  background-color: #fee2e2;
  color: var(--danger-color);
  padding: 0.875rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  text-align: center;
  border: 1.5px solid #fca5a5;
  animation: errorShake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

@keyframes errorShake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-8px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(8px);
  }
}

/* Spinner amélioré avec animation fluide */
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  border-right-color: rgba(255, 255, 255, 0.6);
  animation: spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Animation pour le bouton lors du chargement */
.btn-primary:disabled {
  position: relative;
  overflow: hidden;
}

.btn-primary:disabled::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  animation: buttonPulse 1.5s ease-out infinite;
}

@keyframes buttonPulse {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

.transition-height {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: inputSlide 0.5s ease-out forwards;
  opacity: 0;
}

.transition-height-enter-active,
.transition-height-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.transition-height-enter-from,
.transition-height-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>
