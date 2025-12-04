import { clientApi } from './ApiClient';
import type { Specialite } from '../models';

export class SpecialiteDAO {
    /**
     * Adapte les données de l'API vers le format interne.
     * @param donneesApi Les données reçues de l'API.
     * @returns Un objet Specialite.
     */
    private adapterSpecialite(donneesApi: any): Specialite {
        let nom = donneesApi.name;
        if (!nom) {
            nom = donneesApi.nom;
        }
        return {
            id: donneesApi.id,
            nom: nom,
            name: donneesApi.name
        };
    }

    /**
     * Récupère toutes les spécialités.
     * @returns Une liste de spécialités.
     */
    async obtenirTout(): Promise<Specialite[]> {
        const donnees = await clientApi.obtenir<any[]>('/specialties');
        // Transformation des données avec une boucle simple
        const specialites: Specialite[] = [];
        for (const d of donnees) {
            specialites.push(this.adapterSpecialite(d));
        }
        return specialites;
    }
}
