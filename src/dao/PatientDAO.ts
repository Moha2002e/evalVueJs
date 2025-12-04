import { clientApi } from './ApiClient';
import type { Patient } from '../models';

export class PatientDAO {
    /**
     * Récupère tous les patients.
     * @returns Une liste de patients.
     */
    async obtenirTout(): Promise<Patient[]> {
        return clientApi.obtenir<Patient[]>('/patients');
    }

    /**
     * Récupère un patient par son ID.
     * @param id L'identifiant du patient.
     * @returns Le patient trouvé.
     */
    async obtenirParId(id: number): Promise<Patient> {
        return clientApi.obtenir<Patient>('/patients/' + id);
    }

    /**
     * Crée un nouveau patient.
     * @param patient Les données du patient.
     * @returns Le patient créé.
     */
    async creer(patient: Omit<Patient, 'id'>): Promise<Patient> {
        return clientApi.envoyer<Patient>('/patients', patient);
    }

    /**
     * Gère la connexion ou l'inscription d'un patient.
     * @param nom Le nom du patient.
     * @param prenom Le prénom du patient.
     * @param dateNaissance La date de naissance du patient.
     * @param numeroPatient Le numéro du patient (si existant).
     * @param estNouveau Indique si c'est un nouveau patient.
     * @returns Le patient connecté ou inscrit.
     */
    async connecterPatient(nom: string, prenom: string, dateNaissance: string, numeroPatient: number | null, estNouveau: boolean): Promise<Patient> {
        let dateNaissanceVal = dateNaissance;
        if (!dateNaissanceVal) {
            dateNaissanceVal = "2000-01-01";
        }

        let idPatient = numeroPatient;
        if (!idPatient) {
            idPatient = 0;
        }

        const corps = {
            lastName: nom,
            firstName: prenom,
            birthDate: dateNaissanceVal,
            patientId: idPatient,
            newPatient: estNouveau
        };

        const reponse = await clientApi.envoyer<any>('/patients', corps);

        let id = reponse.patientId;
        if (!id) {
            id = reponse.id;
        }

        return {
            id: id,
            nom: nom,
            prenom: prenom,
            email: '',
            telephone: ''
        };
    }
}
