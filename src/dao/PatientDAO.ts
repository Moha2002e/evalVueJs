import { ApiClient } from './ApiClient';
import type { Patient } from '../models';

export class PatientDAO extends ApiClient {

    async connecterPatient(nom: string, prenom: string, dateNaissance: string, numeroPatient: number | null, nouveauPatient: boolean): Promise<Patient> {
        const payload = {
            lastName: nom,
            firstName: prenom,
            birthDate: dateNaissance,
            newPatient: String(nouveauPatient)
        };

        const response = await this.post<{ success: boolean; patientId: number }>('/patients', payload);

        if (response.success) {
            return {
                id: response.patientId,
                nom: nom,
                prenom: prenom,
                dateNaissance: dateNaissance
            };
        } else {
            throw new Error("Échec de l'authentification");
        }
    }
}
