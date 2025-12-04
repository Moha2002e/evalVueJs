import { clientApi } from './ApiClient';
import type { Consultation } from '../models';

export class ConsultationDAO {
    /**
     * Récupère toutes les consultations.
     * @returns Une liste de consultations.
     */
    async obtenirTout(): Promise<Consultation[]> {
        return clientApi.obtenir<Consultation[]>('/consultations');
    }

    /**
     * Récupère les consultations d'un patient spécifique.
     * @param idPatient L'identifiant du patient.
     * @returns Une liste de consultations pour ce patient.
     */
    async obtenirParPatient(idPatient: number): Promise<Consultation[]> {
        return clientApi.obtenir<Consultation[]>('/consultations?patientId=' + idPatient);
    }

    /**
     * Récupère les consultations disponibles (non réservées).
     * @returns Une liste de consultations disponibles.
     */
    async obtenirDisponibles(): Promise<Consultation[]> {
        return clientApi.obtenir<Consultation[]>('/consultations');
    }

    /**
     * Réserve une consultation pour un patient.
     * @param idConsultation L'identifiant de la consultation.
     * @param idPatient L'identifiant du patient.
     * @param raison Le motif de la consultation.
     * @returns La consultation mise à jour.
     */
    async reserver(idConsultation: number, idPatient: number, raison: string): Promise<Consultation> {
        // Construction de l'URL avec concaténation simple
        const url = clientApi.urlDeBase + '/consultations?id=' + idConsultation;

        // S'assurer que patientId est bien un entier
        const idPatientInt = Math.floor(Number(idPatient));
        if (isNaN(idPatientInt)) {
            throw new Error('ID patient invalide: ' + idPatient);
        }
        if (idPatientInt <= 0) {
            throw new Error('ID patient invalide: ' + idPatient);
        }

        let raisonAEnvoyer = '';
        if (raison) {
            raisonAEnvoyer = raison;
        }

        const corps = {
            patientId: idPatientInt,
            reason: raisonAEnvoyer
        };

        const reponse = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(corps),
        });

        if (!reponse.ok) {
            let messageErreur = 'Erreur HTTP ! statut : ' + reponse.status;
            try {
                const texteErreur = await reponse.text();
                try {
                    const donneesErreur = JSON.parse(texteErreur);
                    if (donneesErreur.error) {
                        messageErreur = messageErreur + ' - ' + donneesErreur.error;
                    } else if (donneesErreur.message) {
                        messageErreur = messageErreur + ' - ' + donneesErreur.message;
                    } else {
                        messageErreur = messageErreur + ' - ' + texteErreur;
                    }
                } catch (erreurAnalyse) {
                    messageErreur = messageErreur + ' - ' + texteErreur;
                }
            } catch (e) {
                console.error('Erreur lors de la lecture de la réponse :', e);
            }
            throw new Error(messageErreur);
        }
        return await reponse.json();
    }

    /**
     * Annule une consultation (la rend disponible).
     * @param id L'identifiant de la consultation.
     */
    async supprimer(id: number): Promise<void> {
        const url = clientApi.urlDeBase + '/consultations?id=' + id;
        const reponse = await fetch(url, {
            method: 'DELETE',
        });

        if (!reponse.ok) {
            throw new Error('Erreur HTTP ! statut : ' + reponse.status);
        }
    }
}
