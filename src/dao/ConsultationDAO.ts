import type { Consultation } from '../models';
export class ConsultationDAO {

    // On définit l'adresse de base de l'API ici pour faire simple
    private adresseApi = '/api';

    // Obtenir les consultations d'un patient
    async obtenirParPatient(idPatient: number): Promise<Consultation[]> {
        // 1. On prépare l'URL avec le paramètre
        const adresseComplete = `${this.adresseApi}/consultations?patientId=${idPatient}`;

        // 2. On fait l'appel au serveur (GET)
        const reponseServeur = await fetch(adresseComplete);

        // 3. On récupère les données en JSON
        const listeConsultations = await reponseServeur.json();

        // 4. On renvoie la liste
        return listeConsultations;
    }

    // Obtenir les créneaux libres
    async obtenirDisponibles(): Promise<Consultation[]> {
        const adresseComplete = `${this.adresseApi}/consultations`;

        const reponseServeur = await fetch(adresseComplete);
        const listeConsultations = await reponseServeur.json();

        return listeConsultations;
    }

    // Réserver un créneau
    async reserver(idConsultation: number, idPatient: number, motifRendezVous: string): Promise<void> {
        const adresseComplete = `${this.adresseApi}/consultations?id=${idConsultation}`;

        // On prépare les données à envoyer
        const donneesReservation = {
            patientId: idPatient,
            reason: motifRendezVous
        };

        // On envoie la requête PUT avec les données
        await fetch(adresseComplete, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donneesReservation)
        });
    }

    // Annuler une réservation
    async supprimer(idConsultation: number): Promise<void> {
        const adresseComplete = `${this.adresseApi}/consultations?id=${idConsultation}`;

        // On envoie la requête DELETE
        await fetch(adresseComplete, {
            method: 'DELETE'
        });
    }
}
