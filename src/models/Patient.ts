export interface Patient {
    id: number;
    nom: string;
    prenom: string;
    dateNaissance?: string;
    token?: string; // Au cas où on a besoin d'auth
}
