import type { Specialite } from '../models';

export class SpecialiteDAO {

    private adresseApi = '/api';

    async obtenirTout(): Promise<Specialite[]> {
        const adresseComplete = `${this.adresseApi}/specialties`;

        // On récupère la liste des spécialités
        const reponseServeur = await fetch(adresseComplete);

        // On retourne la réponse en JSON
        return await reponseServeur.json();
    }
}
