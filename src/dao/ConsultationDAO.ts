import { ApiClient } from './ApiClient';
import type { Consultation } from '../models';

export class ConsultationDAO extends ApiClient {

    // Obtenir les consultations réservées par le patient
    async obtenirParPatient(patientId: number): Promise<Consultation[]> {
        return this.get<Consultation[]>(`/consultations?patientId=${patientId}`);
    }

    // Obtenir les créneaux disponibles (ceux qui n'ont pas de patientId assigné)
    async obtenirDisponibles(): Promise<Consultation[]> {
        return this.get<Consultation[]>('/consultations');
    }

    // Réserver : PUT sur /consultations?id=... avec body { patientId, reason }
    async reserver(consultationId: number, patientId: number, motif: string): Promise<void> {
        const payload = {
            patientId: patientId, // Backend attend number ou string parsable
            reason: motif
        };
        // L'ID est passé en query param selon le handler (gererPut -> obtenirParametresRequete -> id)
        await this.put<{ success: boolean }>(`/consultations?id=${consultationId}`, payload);
    }

    // Annuler : DELETE sur /consultations?id=...
    async supprimer(consultationId: number): Promise<void> {
        await this.delete(`/consultations?id=${consultationId}`);
    }
}
