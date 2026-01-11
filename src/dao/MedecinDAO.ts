import { ApiClient } from './ApiClient';
import type { Medecin } from '../models';

export class MedecinDAO extends ApiClient {
    async obtenirTout(): Promise<Medecin[]> {
        return this.get<Medecin[]>('/doctors');
    }
}
