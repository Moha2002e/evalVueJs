import { clientApi } from './ApiClient';
import type { Medecin } from '../models';

export class MedecinDAO {
    /**
     * Adapte les données de l'API vers le format interne.
     * @param donneesApi Les données reçues de l'API.
     * @returns Un objet Medecin.
     */
    private adapterMedecin(donneesApi: any): Medecin {
        let idSpecialite = donneesApi.specialite_id;
        if (!idSpecialite) {
            idSpecialite = donneesApi.specialiteId;
        }

        let nom = donneesApi.last_name;
        if (!nom) {
            nom = donneesApi.nom;
        }

        let prenom = donneesApi.first_name;
        if (!prenom) {
            prenom = donneesApi.prenom;
        }

        return {
            id: donneesApi.id,
            specialiteId: idSpecialite,
            nom: nom,
            prenom: prenom,
            specialite_id: idSpecialite,
            last_name: nom,
            first_name: prenom
        };
    }

    /**
     * Récupère la liste de tous les médecins.
     * @returns Une liste de médecins.
     */
    async obtenirTout(): Promise<Medecin[]> {
        const donnees = await clientApi.obtenir<any[]>('/doctors');
        // Transformation des données avec une boucle simple
        const medecins: Medecin[] = [];
        for (const d of donnees) {
            medecins.push(this.adapterMedecin(d));
        }
        return medecins;
    }

    /**
     * Récupère un médecin par son ID.
     * @param id L'identifiant du médecin.
     * @returns Le médecin trouvé.
     */
    async obtenirParId(id: number): Promise<Medecin> {
        const tout = await this.obtenirTout();
        const trouve = tout.find(m => m.id === id);
        if (!trouve) {
            throw new Error("Médecin non trouvé");
        }
        return trouve;
    }

    /**
     * Récupère les médecins par spécialité.
     * @param nomSpecialite Le nom de la spécialité.
     * @returns Une liste de médecins.
     */
    async obtenirParSpecialite(nomSpecialite: string): Promise<Medecin[]> {
        const url = '/doctors?specialty=' + encodeURIComponent(nomSpecialite);
        return clientApi.obtenir<Medecin[]>(url);
    }
}
