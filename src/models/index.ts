/**
 * Interface représentant un patient.
 */
export interface Patient {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
}

/**
 * Interface représentant un médecin.
 */
export interface Medecin {
    id: number;
    // Format API (snake_case en anglais)
    specialite_id?: number;
    last_name?: string;
    first_name?: string;
    // Format interne (camelCase en français)
    specialiteId: number;
    nom: string;
    prenom: string;
}

/**
 * Interface représentant une spécialité.
 */
export interface Specialite {
    id: number;
    // Format API (anglais)
    name?: string;
    // Format interne (français)
    nom: string;
}

/**
 * Interface représentant une consultation.
 */
export interface Consultation {
    id: number;
    date: string; // Date au format YYYY-MM-DD
    hour?: string; // Heure séparée (optionnel)
    doctor_id: number; // Format API: snake_case
    patient_id?: number | null; // Format API: snake_case
    reason?: string; // Format API: reason (anglais)
    // Alias pour compatibilité avec le code existant
    medecinId?: number;
    patientId?: number | null;
    motif?: string;
}

/**
 * Interface représentant un créneau horaire.
 */
export interface Creneau {
    heure: string;
    disponible: boolean;
}
