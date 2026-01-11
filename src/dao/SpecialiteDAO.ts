import { ApiClient } from './ApiClient';
import type { Specialite } from '../models';

export class SpecialiteDAO extends ApiClient {
    async obtenirTout(): Promise<Specialite[]> {
        return this.get<Specialite[]>('/specialties');
    }
}
