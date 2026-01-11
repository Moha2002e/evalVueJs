import type { Medecin } from '../models';
export class MedecinDAO {

    private adresseApi = '/api';

    async obtenirTout(): Promise<Medecin[]> {
        const adresseComplete = `${this.adresseApi}/doctors`;

        // On récupère la liste des médecins
        const reponseServeur = await fetch(adresseComplete);

        // On retourne la réponse en JSON
        return await reponseServeur.json();
    }
}
