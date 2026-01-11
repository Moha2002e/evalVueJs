import type { Patient } from '../models';

export class PatientDAO {

    private adresseApi = '/api';


    async connecterPatient(nom: string, prenom: string, dateNaissance: string, numeroPatient: number | null, nouveauPatient: boolean): Promise<Patient> {//resultat qqui represente le resultat futur
        // On prépare les données à envoyer
        const donneesPatientAEnvoyer = {
            lastName: nom,
            firstName: prenom,
            birthDate: dateNaissance,
            patientId: numeroPatient,
            newPatient: String(nouveauPatient)
        };

        const adresseComplete = `${this.adresseApi}/patients`;

        // On fait l'appel POST
        const reponseServeur = await fetch(adresseComplete, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(donneesPatientAEnvoyer)
        });

        // On traite la réponse
        const reponseJson = await reponseServeur.json();

        // Si l'API nous renvoie un succès
        if (reponseServeur.ok && reponseJson.success) {
            return {
                id: reponseJson.patientId,
                nom: nom,
                prenom: prenom
            };
        } else {
            console.error("Erreur API Login:", reponseServeur.status, reponseJson);
            // Sinon on lève une erreur
            throw new Error(reponseJson.message || "Échec de l'authentification");
        }
    }
}
