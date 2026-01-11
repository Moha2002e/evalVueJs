export interface Consultation {
    id: number;
    date: string;       // Format YYYY-MM-DD
    hour?: string;      // Format HH:MM:SS
    doctor_id: number;
    patient_id?: number | null;
    reason?: string;
}
