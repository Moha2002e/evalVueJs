export class ClientApi {
    public urlDeBase: string;

    /**
     * Constructeur de la classe ClientApi.
     * @param urlDeBase L'URL de base de l'API.
     */
    constructor(urlDeBase: string) {
        this.urlDeBase = urlDeBase;
    }

    /**
     * Effectue une requête GET vers l'API.
     * @param chemin Le chemin de la ressource (ex: /users).
     * @returns Une promesse contenant la réponse JSON.
     */
    async obtenir<T>(chemin: string): Promise<T> {
        const url = this.urlDeBase + chemin;
        const reponse = await fetch(url);
        if (!reponse.ok) {
            throw new Error('Erreur HTTP ! statut : ' + reponse.status);
        }
        return await reponse.json();
    }

    /**
     * Effectue une requête POST vers l'API.
     * @param chemin Le chemin de la ressource.
     * @param donnees Les données à envoyer dans le corps de la requête.
     * @returns Une promesse contenant la réponse JSON.
     */
    async envoyer<T>(chemin: string, donnees: any): Promise<T> {
        const url = this.urlDeBase + chemin;
        const reponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(donnees),
        });
        if (!reponse.ok) {
            throw new Error('Erreur HTTP ! statut : ' + reponse.status);
        }
        return await reponse.json();
    }

    /**
     * Effectue une requête PATCH vers l'API.
     * @param chemin Le chemin de la ressource.
     * @param donnees Les données à mettre à jour.
     * @returns Une promesse contenant la réponse JSON.
     */
    async mettreAJour<T>(chemin: string, donnees: any): Promise<T> {
        const url = this.urlDeBase + chemin;
        const reponse = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(donnees),
        });
        if (!reponse.ok) {
            throw new Error('Erreur HTTP ! statut : ' + reponse.status);
        }
        return await reponse.json();
    }

    /**
     * Effectue une requête DELETE vers l'API.
     * @param chemin Le chemin de la ressource à supprimer.
     * @returns Une promesse vide.
     */
    async supprimer(chemin: string): Promise<void> {
        const url = this.urlDeBase + chemin;
        const reponse = await fetch(url, {
            method: 'DELETE',
        });
        if (!reponse.ok) {
            throw new Error('Erreur HTTP ! statut : ' + reponse.status);
        }
    }
}

export const clientApi = new ClientApi('/api');
